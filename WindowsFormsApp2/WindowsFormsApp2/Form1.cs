using System;
using System.IO;
using System.Text;
using System.Windows.Forms;

namespace WindowsFormsApp2
{
    public partial class Form1 : Form
    {
        private int remainingSeconds = 0;
        private bool isRunning = false;
        private bool editVisible = true;
        private bool topMostEnabled = false;
        private bool isCountUp = false;
        private int targetSeconds = 0; // 用于正向计时的目标时长（秒）
        private string logFilePath;

        public Form1()
        {
            InitializeComponent();

            // 默认值
            if (nudHours != null) nudHours.Value = 0;
            if (nudMinutes != null) nudMinutes.Value = 1;
            if (nudSeconds != null) nudSeconds.Value = 0;

            // 模式默认：倒计时
            if (rbCountDown != null) rbCountDown.Checked = true;

            // 日志文件路径
            logFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "timer_log.txt");
            LoadLogToTextBox();

            UpdateDisplayFromNumeric();
            // 确保编辑控件可见
            nudHours.Visible = nudMinutes.Visible = nudSeconds.Visible = true;
        }

        private void UpdateDisplay()
        {
            int h = remainingSeconds / 3600;
            int m = (remainingSeconds % 3600) / 60;
            int s = remainingSeconds % 60;
            if (labelTime != null)
            {
                labelTime.Text = string.Format("{0:D2}:{1:D2}:{2:D2}", h, m, s);
            }
        }

        private void UpdateDisplayFromNumeric()
        {
            if (nudHours == null || nudMinutes == null || nudSeconds == null) return;
            int configured = (int)nudHours.Value * 3600 + (int)nudMinutes.Value * 60 + (int)nudSeconds.Value;
            // 根据模式设置初始值
            isCountUp = rbCountUp != null && rbCountUp.Checked;
            if (isCountUp)
            {
                // 正向计时从0开始，记录目标
                remainingSeconds = 0;
                targetSeconds = configured;
            }
            else
            {
                // 反向计时直接设置剩余时间
                remainingSeconds = configured;
                targetSeconds = configured;
            }
            UpdateDisplay();
        }

        private void btnEdit_Click(object sender, EventArgs e)
        {
            // 切换编辑区域（三个 NumericUpDown 的可见性）
            editVisible = !editVisible;
            nudHours.Visible = nudMinutes.Visible = nudSeconds.Visible = editVisible;
            if (lblHours != null) lblHours.Visible = editVisible;
            if (lblMinutes != null) lblMinutes.Visible = editVisible;
            if (lblSeconds != null) lblSeconds.Visible = editVisible;
            //btnEdit.Text = editVisible ? "编辑计时器" : "隐藏编辑";
        }

        private void btnExportLog_Click(object sender, EventArgs e)
        {
            try
            {
                using (SaveFileDialog sfd = new SaveFileDialog())
                {
                    sfd.Filter = "Text Files|*.txt|All Files|*.*";
                    sfd.FileName = "timer_log_" + DateTime.Now.ToString("yyyyMMdd_HHmmss") + ".txt";
                    if (sfd.ShowDialog() == DialogResult.OK)
                    {
                        string content = string.Empty;
                        if (txtLog != null)
                            content = txtLog.Text;
                        else if (File.Exists(logFilePath))
                            content = File.ReadAllText(logFilePath, Encoding.UTF8);

                        File.WriteAllText(sfd.FileName, content, Encoding.UTF8);
                        MessageBox.Show("导出成功。", "提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("导出日志失败：" + ex.Message, "错误", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btnClearLog_Click(object sender, EventArgs e)
        {
            var dr = MessageBox.Show("确定要清空日志吗？此操作不可撤销。", "确认", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
            if (dr != DialogResult.Yes) return;
            try
            {
                if (File.Exists(logFilePath))
                {
                    File.WriteAllText(logFilePath, string.Empty, Encoding.UTF8);
                }
                if (txtLog != null)
                {
                    txtLog.Clear();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("清空日志失败：" + ex.Message, "错误", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btnStart_Click(object sender, EventArgs e)
        {
            if (!isRunning)
            {
                // 启动计时器
                UpdateDisplayFromNumeric();

                // 对于正向计时，需要确保目标大于0；对于反向计时，剩余需大于0
                if (isCountUp)
                {
                    //if (targetSeconds <= 0)
                    //{
                    //    //MessageBox.Show("请设置一个大于 0 的目标时长（时/分/秒）。", "提示", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    //    return;
                    //}
                }
                else
                {
                    if (remainingSeconds <= 0)
                    {
                        MessageBox.Show("请设置一个大于 0 的时间。", "提示", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                        return;
                    }
                }

                timer1.Start();
                isRunning = true;
                btnStart.Text = "停止";
                nudHours.Enabled = nudMinutes.Enabled = nudSeconds.Enabled = false;

                // 写入日志：记录启动事件，包含模式、分钟数与标题
                int minutes = (isCountUp ? targetSeconds : remainingSeconds) / 60;
                string title = txtTitle != null ? txtTitle.Text.Trim() : string.Empty;
                string action = isCountUp ? "正向计时" : "反向计时";
                if(!isCountUp)
                AppendLog(string.Format("{0} {1}{2}分钟 {3}", DateTime.Now.ToString("yyyy.MM.dd HH:mm:ss"), action, minutes, string.IsNullOrEmpty(title) ? string.Empty : (" " + title)));
                else AppendLog(string.Format("{0} {1} {2}", DateTime.Now.ToString("yyyy.MM.dd HH:mm:ss"), action, string.IsNullOrEmpty(title) ? string.Empty : (" " + title)));
            }
            else
            {
                // 暂停
                timer1.Stop();
                isRunning = false;
                btnStart.Text = "开始";
                nudHours.Enabled = nudMinutes.Enabled = nudSeconds.Enabled = true;

                string title = txtTitle != null ? txtTitle.Text.Trim() : string.Empty;
                AppendLog(string.Format("{0} 停止计时 {1}", DateTime.Now.ToString("yyyy.MM.dd HH:mm:ss"), string.IsNullOrEmpty(title) ? string.Empty : (" " + title)));
            }
        }

        private void btnReset_Click(object sender, EventArgs e)
        {
            timer1.Stop();
            isRunning = false;
            btnStart.Text = "开始";
            nudHours.Enabled = nudMinutes.Enabled = nudSeconds.Enabled = true;
            UpdateDisplayFromNumeric();
            string title = txtTitle != null ? txtTitle.Text.Trim() : string.Empty;
            AppendLog(string.Format("{0} 重置计时 {1}", DateTime.Now.ToString("yyyy.MM.dd HH:mm:ss"), string.IsNullOrEmpty(title) ? string.Empty : (" " + title)));
        }

        private void btnTopMost_Click(object sender, EventArgs e)
        {
            topMostEnabled = !topMostEnabled;
            this.TopMost = topMostEnabled;
            btnTopMost.Text = topMostEnabled ? "置顶：开启" : "置顶：关闭";
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            if (isCountUp)
            {
                // 正向计时：从0递增到目标
                targetSeconds = int.MaxValue;
                remainingSeconds++;
                UpdateDisplay();
                if (remainingSeconds >= targetSeconds)
                {
                    // 到达目标
                    timer1.Stop();
                    isRunning = false;
                    btnStart.Text = "开始";
                    nudHours.Enabled = nudMinutes.Enabled = nudSeconds.Enabled = true;
                    MessageBox.Show("计时结束（已到达目标）！", "提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    string title = txtTitle != null ? txtTitle.Text.Trim() : string.Empty;
                    AppendLog(string.Format("{0} 正向计时结束 {1}", DateTime.Now.ToString("yyyy.MM.dd HH:mm:ss"), string.IsNullOrEmpty(title) ? string.Empty : (" " + title)));
                }
            }
            else
            {
                // 反向计时：递减
                if (remainingSeconds > 0)
                {
                    remainingSeconds--;
                    UpdateDisplay();

                    if (remainingSeconds <= 0)
                    {
                        timer1.Stop();
                        isRunning = false;
                        btnStart.Text = "开始";
                        nudHours.Enabled = nudMinutes.Enabled = nudSeconds.Enabled = true;
                        MessageBox.Show("计时结束！", "提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        string title = txtTitle != null ? txtTitle.Text.Trim() : string.Empty;
                        AppendLog(string.Format("{0} 反向计时结束 {1}", DateTime.Now.ToString("yyyy.MM.dd HH:mm:ss"), string.IsNullOrEmpty(title) ? string.Empty : (" " + title)));
                    }
                }
            }
        }

        private void AppendLog(string line)
        {
            try
            {
                File.AppendAllText(logFilePath, line + Environment.NewLine, Encoding.UTF8);
                // 同步显示到文本框（追加并保持滚动到底部）
                if (txtLog != null)
                {
                    txtLog.AppendText(line + Environment.NewLine);
                    txtLog.SelectionStart = txtLog.TextLength;
                    txtLog.ScrollToCaret();
                }
            }
            catch (Exception ex)
            {
                // 如果写日志失败，不影响计时功能
                System.Diagnostics.Debug.WriteLine("AppendLog error: " + ex.Message);
            }
        }

        private void LoadLogToTextBox()
        {
            try
            {
                if (File.Exists(logFilePath))
                {
                    // 读取全部或最后若干行（这里读取全部，文件不会很大）
                    string content = File.ReadAllText(logFilePath, Encoding.UTF8);
                    if (txtLog != null) txtLog.Text = content;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("LoadLogToTextBox error: " + ex.Message);
            }
        }

        private void lblMode_Click(object sender, EventArgs e)
        {


        }
    }
}
