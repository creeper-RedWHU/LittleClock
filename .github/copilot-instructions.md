# Copilot Instructions for LittleClock

This repository contains a lightweight timer application built with Windows Forms and C# targeting .NET Framework 4.8.

## Project Overview

LittleClock (WindowsFormsApp2) is a simple timer application that supports:
- Forward counting (stopwatch mode) and reverse counting (countdown mode)
- Timer event logging to `timer_log.txt`
- Log export and clear functionality
- Window always-on-top toggle
- Editable timer interface

## Technology Stack

- **Language**: C# (.NET Framework 4.8)
- **UI Framework**: Windows Forms
- **IDE**: Visual Studio 2019/2022
- **Platform**: Windows only

## Project Structure

- `WindowsFormsApp2/WindowsFormsApp2.sln` - Visual Studio solution file
- `WindowsFormsApp2/WindowsFormsApp2/WindowsFormsApp2.csproj` - Project file
- `WindowsFormsApp2/WindowsFormsApp2/Form1.cs` - Main form logic (timer, logging, button events)
- `WindowsFormsApp2/WindowsFormsApp2/Form1.Designer.cs` - Designer-generated UI code
- `WindowsFormsApp2/WindowsFormsApp2/Program.cs` - Application entry point

## Build Instructions

This project requires Windows and Visual Studio with .NET Framework 4.8 support.

1. Open `WindowsFormsApp2/WindowsFormsApp2.sln` in Visual Studio
2. Build using Debug or Release configuration
3. Run with F5 (debug) or Ctrl+F5 (without debugging)

Alternatively, use MSBuild from command line:
```
msbuild WindowsFormsApp2/WindowsFormsApp2.sln /p:Configuration=Debug
```

## Coding Conventions

- Use Chinese for user-facing strings and comments (this is a Chinese-language application)
- Follow standard C# naming conventions (PascalCase for public members, camelCase for private fields)
- Handle exceptions gracefully without interrupting core timer functionality
- Use `System.IO` for file operations with UTF-8 encoding
- Prefix private fields with descriptive names (e.g., `remainingSeconds`, `isRunning`)

## Important Notes

- The log file `timer_log.txt` is created in the application's runtime directory
- The application uses a `System.Windows.Forms.Timer` for timing operations
- UI controls are defined in `Form1.Designer.cs` - avoid manual edits to designer-generated code
- The application supports both forward and reverse timer modes controlled by radio buttons

## Testing

This project currently has no automated tests. Manual testing should verify:
- Timer starts, stops, and resets correctly in both modes
- Log entries are written correctly with timestamps
- UI controls respond appropriately
- Window top-most toggle works

## Future Development Suggestions

- Add sound notifications when timer completes
- Implement system tray minimization with `NotifyIcon`
- Add multi-language support using resource files (.resx)
