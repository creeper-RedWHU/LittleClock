# Copilot Instructions for LittleClock

This repository contains a Windows Forms timer application (计时器) written in C# targeting .NET Framework 4.8.

## Project Overview

LittleClock is a lightweight timer application that supports:
- Forward timing (正向计时) - counting up from 0 to a target
- Reverse timing (反向计时) - countdown from a set time to 0
- Event logging to `timer_log.txt`
- Log export and clearing
- Window pinning (置顶) functionality

## Development Environment

- **IDE**: Visual Studio 2019/2022
- **Framework**: .NET Framework 4.8
- **Platform**: Windows only
- **Language**: C# with Windows Forms

## Project Structure

```
WindowsFormsApp2/
├── WindowsFormsApp2.sln          # Visual Studio solution file
└── WindowsFormsApp2/
    ├── WindowsFormsApp2.csproj   # Project file
    ├── Form1.cs                  # Main form logic (timer, logging, events)
    ├── Form1.Designer.cs         # Designer-generated UI code
    ├── Form1.resx                # Form resources
    ├── Program.cs                # Application entry point
    └── Properties/               # Assembly info and resources
```

## Coding Guidelines

### Language
- Code comments and variable names should be in English
- User-facing strings (UI text, messages) are in Chinese (Simplified)
- Log entries are formatted in Chinese

### Code Style
- Follow standard C# naming conventions (PascalCase for public members, camelCase for private fields)
- Use `null` checks before accessing UI controls
- Handle exceptions gracefully, especially for file I/O operations
- Use `System.Diagnostics.Debug.WriteLine` for debug logging

### UI Development
- Do not manually edit `Form1.Designer.cs` - use the Visual Studio Forms Designer
- Keep UI logic separate from business logic where possible
- All timer-related state is managed in `Form1.cs`

### File Operations
- Log file path: `timer_log.txt` in the application directory
- Use `UTF-8` encoding for all file operations
- File I/O errors should not interrupt timer functionality

## Building and Running

To build the project:
1. Open `WindowsFormsApp2.sln` in Visual Studio
2. Select Debug or Release configuration
3. Build the solution (Ctrl+Shift+B)

To run:
- Press F5 (Debug) or Ctrl+F5 (Run without debugging)
- Or execute `WindowsFormsApp2.exe` from `bin/Debug/` or `bin/Release/`

## Testing

This project currently does not have automated tests. Manual testing should verify:
- Timer starts, stops, and resets correctly in both modes
- Log entries are written and displayed properly
- Export and clear log functions work as expected
- Window pinning toggles correctly

## Future Development Considerations

When adding new features, consider:
- Sound notifications using `System.Media.SystemSounds` or `SoundPlayer`
- System tray integration using `NotifyIcon`
- Localization support via `.resx` resource files
