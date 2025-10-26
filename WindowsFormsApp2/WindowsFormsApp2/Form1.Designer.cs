namespace WindowsFormsApp2
{
    partial class Form1
    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
    private System.ComponentModel.IContainer components = null;

    // 新增控件声明
    private System.Windows.Forms.Label labelTime;
    private System.Windows.Forms.NumericUpDown nudHours;
    private System.Windows.Forms.NumericUpDown nudMinutes;
    private System.Windows.Forms.NumericUpDown nudSeconds;
    private System.Windows.Forms.Button btnReset;
    private System.Windows.Forms.Button btnStart;
    private System.Windows.Forms.Button btnTopMost;
    private System.Windows.Forms.Timer timer1;
    private System.Windows.Forms.RadioButton rbCountDown;
    private System.Windows.Forms.RadioButton rbCountUp;
    private System.Windows.Forms.Label lblMode;
    private System.Windows.Forms.Label lblTitle;
    private System.Windows.Forms.TextBox txtTitle;
    private System.Windows.Forms.TextBox txtLog;
    private System.Windows.Forms.Button btnExportLog;
    private System.Windows.Forms.Button btnClearLog;
    private System.Windows.Forms.Label lblHours;
    private System.Windows.Forms.Label lblMinutes;
    private System.Windows.Forms.Label lblSeconds;

        /// <summary>
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows 窗体设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要修改
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.labelTime = new System.Windows.Forms.Label();
            this.nudHours = new System.Windows.Forms.NumericUpDown();
            this.nudMinutes = new System.Windows.Forms.NumericUpDown();
            this.nudSeconds = new System.Windows.Forms.NumericUpDown();
            this.btnReset = new System.Windows.Forms.Button();
            this.btnStart = new System.Windows.Forms.Button();
            this.btnTopMost = new System.Windows.Forms.Button();
            this.rbCountDown = new System.Windows.Forms.RadioButton();
            this.rbCountUp = new System.Windows.Forms.RadioButton();
            this.lblMode = new System.Windows.Forms.Label();
            this.lblTitle = new System.Windows.Forms.Label();
            this.txtTitle = new System.Windows.Forms.TextBox();
            this.txtLog = new System.Windows.Forms.TextBox();
            this.btnExportLog = new System.Windows.Forms.Button();
            this.btnClearLog = new System.Windows.Forms.Button();
            this.lblHours = new System.Windows.Forms.Label();
            this.lblMinutes = new System.Windows.Forms.Label();
            this.lblSeconds = new System.Windows.Forms.Label();
            this.timer1 = new System.Windows.Forms.Timer(this.components);
            ((System.ComponentModel.ISupportInitialize)(this.nudHours)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudMinutes)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudSeconds)).BeginInit();
            this.SuspendLayout();
            // 
            // labelTime
            // 
            this.labelTime.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.labelTime.Font = new System.Drawing.Font("Microsoft Sans Serif", 60F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.labelTime.ForeColor = System.Drawing.Color.DarkSlateGray;
            this.labelTime.Location = new System.Drawing.Point(60, 20);
            this.labelTime.Name = "labelTime";
            this.labelTime.Size = new System.Drawing.Size(680, 100);
            this.labelTime.TabIndex = 0;
            this.labelTime.Text = "00:00:00";
            this.labelTime.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // nudHours
            // 
            this.nudHours.Font = new System.Drawing.Font("微软雅黑", 12F);
            this.nudHours.Location = new System.Drawing.Point(220, 208);
            this.nudHours.Maximum = new decimal(new int[] {
            99,
            0,
            0,
            0});
            this.nudHours.Name = "nudHours";
            this.nudHours.Size = new System.Drawing.Size(60, 34);
            this.nudHours.TabIndex = 1;
            this.nudHours.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // nudMinutes
            // 
            this.nudMinutes.Font = new System.Drawing.Font("微软雅黑", 12F);
            this.nudMinutes.Location = new System.Drawing.Point(300, 208);
            this.nudMinutes.Maximum = new decimal(new int[] {
            59,
            0,
            0,
            0});
            this.nudMinutes.Name = "nudMinutes";
            this.nudMinutes.Size = new System.Drawing.Size(60, 34);
            this.nudMinutes.TabIndex = 2;
            this.nudMinutes.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // nudSeconds
            // 
            this.nudSeconds.Font = new System.Drawing.Font("微软雅黑", 12F);
            this.nudSeconds.Location = new System.Drawing.Point(380, 208);
            this.nudSeconds.Maximum = new decimal(new int[] {
            59,
            0,
            0,
            0});
            this.nudSeconds.Name = "nudSeconds";
            this.nudSeconds.Size = new System.Drawing.Size(60, 34);
            this.nudSeconds.TabIndex = 3;
            this.nudSeconds.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // btnReset
            // 
            this.btnReset.BackColor = System.Drawing.Color.LightGoldenrodYellow;
            this.btnReset.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnReset.Font = new System.Drawing.Font("微软雅黑", 11F);
            this.btnReset.Location = new System.Drawing.Point(219, 285);
            this.btnReset.Name = "btnReset";
            this.btnReset.Size = new System.Drawing.Size(100, 38);
            this.btnReset.TabIndex = 5;
            this.btnReset.Text = "重置";
            this.btnReset.UseVisualStyleBackColor = false;
            this.btnReset.Click += new System.EventHandler(this.btnReset_Click);
            // 
            // btnStart
            // 
            this.btnStart.BackColor = System.Drawing.Color.LightGreen;
            this.btnStart.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnStart.Font = new System.Drawing.Font("微软雅黑", 11F);
            this.btnStart.Location = new System.Drawing.Point(325, 285);
            this.btnStart.Name = "btnStart";
            this.btnStart.Size = new System.Drawing.Size(159, 38);
            this.btnStart.TabIndex = 6;
            this.btnStart.Text = "开始";
            this.btnStart.UseVisualStyleBackColor = false;
            this.btnStart.Click += new System.EventHandler(this.btnStart_Click);
            // 
            // btnTopMost
            // 
            this.btnTopMost.BackColor = System.Drawing.Color.LightGray;
            this.btnTopMost.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnTopMost.Font = new System.Drawing.Font("微软雅黑", 11F);
            this.btnTopMost.Location = new System.Drawing.Point(490, 285);
            this.btnTopMost.Name = "btnTopMost";
            this.btnTopMost.Size = new System.Drawing.Size(149, 38);
            this.btnTopMost.TabIndex = 7;
            this.btnTopMost.Text = "置顶：关闭";
            this.btnTopMost.UseVisualStyleBackColor = false;
            this.btnTopMost.Click += new System.EventHandler(this.btnTopMost_Click);
            // 
            // rbCountDown
            // 
            this.rbCountDown.AutoSize = true;
            this.rbCountDown.Font = new System.Drawing.Font("微软雅黑", 12F);
            this.rbCountDown.Location = new System.Drawing.Point(220, 150);
            this.rbCountDown.Name = "rbCountDown";
            this.rbCountDown.Size = new System.Drawing.Size(93, 31);
            this.rbCountDown.TabIndex = 9;
            this.rbCountDown.TabStop = true;
            this.rbCountDown.Text = "倒计时";
            this.rbCountDown.UseVisualStyleBackColor = true;
            // 
            // rbCountUp
            // 
            this.rbCountUp.AutoSize = true;
            this.rbCountUp.Font = new System.Drawing.Font("微软雅黑", 12F);
            this.rbCountUp.Location = new System.Drawing.Point(340, 150);
            this.rbCountUp.Name = "rbCountUp";
            this.rbCountUp.Size = new System.Drawing.Size(113, 31);
            this.rbCountUp.TabIndex = 10;
            this.rbCountUp.TabStop = true;
            this.rbCountUp.Text = "正向计时";
            this.rbCountUp.UseVisualStyleBackColor = true;
            // 
            // lblMode
            // 
            this.lblMode.Font = new System.Drawing.Font("微软雅黑", 12F, System.Drawing.FontStyle.Bold);
            this.lblMode.Location = new System.Drawing.Point(138, 150);
            this.lblMode.Name = "lblMode";
            this.lblMode.Size = new System.Drawing.Size(124, 28);
            this.lblMode.TabIndex = 8;
            this.lblMode.Text = "模式：";
            this.lblMode.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.lblMode.Click += new System.EventHandler(this.lblMode_Click);
            // 
            // lblTitle
            // 
            this.lblTitle.Font = new System.Drawing.Font("微软雅黑", 12F, System.Drawing.FontStyle.Bold);
            this.lblTitle.Location = new System.Drawing.Point(140, 248);
            this.lblTitle.Name = "lblTitle";
            this.lblTitle.Size = new System.Drawing.Size(91, 28);
            this.lblTitle.TabIndex = 11;
            this.lblTitle.Text = "标题：";
            this.lblTitle.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // txtTitle
            // 
            this.txtTitle.Font = new System.Drawing.Font("微软雅黑", 12F);
            this.txtTitle.Location = new System.Drawing.Point(219, 247);
            this.txtTitle.Name = "txtTitle";
            this.txtTitle.Size = new System.Drawing.Size(420, 34);
            this.txtTitle.TabIndex = 12;
            // 
            // txtLog
            // 
            this.txtLog.Location = new System.Drawing.Point(140, 329);
            this.txtLog.Multiline = true;
            this.txtLog.Name = "txtLog";
            this.txtLog.ReadOnly = true;
            this.txtLog.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.txtLog.Size = new System.Drawing.Size(500, 120);
            this.txtLog.TabIndex = 13;
            // 
            // btnExportLog
            // 
            this.btnExportLog.Location = new System.Drawing.Point(660, 327);
            this.btnExportLog.Name = "btnExportLog";
            this.btnExportLog.Size = new System.Drawing.Size(80, 23);
            this.btnExportLog.TabIndex = 14;
            this.btnExportLog.Text = "导出";
            this.btnExportLog.UseVisualStyleBackColor = true;
            this.btnExportLog.Click += new System.EventHandler(this.btnExportLog_Click);
            // 
            // btnClearLog
            // 
            this.btnClearLog.Location = new System.Drawing.Point(660, 366);
            this.btnClearLog.Name = "btnClearLog";
            this.btnClearLog.Size = new System.Drawing.Size(80, 23);
            this.btnClearLog.TabIndex = 15;
            this.btnClearLog.Text = "清空";
            this.btnClearLog.UseVisualStyleBackColor = true;
            this.btnClearLog.Click += new System.EventHandler(this.btnClearLog_Click);
            // 
            // lblHours
            // 
            this.lblHours.Font = new System.Drawing.Font("微软雅黑", 10F, System.Drawing.FontStyle.Bold);
            this.lblHours.Location = new System.Drawing.Point(220, 183);
            this.lblHours.Name = "lblHours";
            this.lblHours.Size = new System.Drawing.Size(60, 20);
            this.lblHours.TabIndex = 16;
            this.lblHours.Text = "小时";
            this.lblHours.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lblMinutes
            // 
            this.lblMinutes.Font = new System.Drawing.Font("微软雅黑", 10F, System.Drawing.FontStyle.Bold);
            this.lblMinutes.Location = new System.Drawing.Point(300, 183);
            this.lblMinutes.Name = "lblMinutes";
            this.lblMinutes.Size = new System.Drawing.Size(60, 20);
            this.lblMinutes.TabIndex = 17;
            this.lblMinutes.Text = "分钟";
            this.lblMinutes.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lblSeconds
            // 
            this.lblSeconds.Font = new System.Drawing.Font("微软雅黑", 10F, System.Drawing.FontStyle.Bold);
            this.lblSeconds.Location = new System.Drawing.Point(380, 183);
            this.lblSeconds.Name = "lblSeconds";
            this.lblSeconds.Size = new System.Drawing.Size(60, 20);
            this.lblSeconds.TabIndex = 18;
            this.lblSeconds.Text = "秒";
            this.lblSeconds.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // timer1
            // 
            this.timer1.Interval = 1000;
            this.timer1.Tick += new System.EventHandler(this.timer1_Tick);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 460);
            this.Controls.Add(this.btnClearLog);
            this.Controls.Add(this.btnExportLog);
            this.Controls.Add(this.txtLog);
            this.Controls.Add(this.txtTitle);
            this.Controls.Add(this.lblTitle);
            this.Controls.Add(this.rbCountUp);
            this.Controls.Add(this.rbCountDown);
            this.Controls.Add(this.lblMode);
            this.Controls.Add(this.btnTopMost);
            this.Controls.Add(this.btnStart);
            this.Controls.Add(this.btnReset);
            this.Controls.Add(this.lblSeconds);
            this.Controls.Add(this.lblMinutes);
            this.Controls.Add(this.lblHours);
            this.Controls.Add(this.nudSeconds);
            this.Controls.Add(this.nudMinutes);
            this.Controls.Add(this.nudHours);
            this.Controls.Add(this.labelTime);
            this.Name = "Form1";
            this.Text = "简易计时器";
            ((System.ComponentModel.ISupportInitialize)(this.nudHours)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudMinutes)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nudSeconds)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
    }
}

