# OnePlus Floating Desktop Clock for Windows

An authentic, transparent floating Windows desktop clock inspired directly by OxygenOS on OnePlus devices. Recreated with faithful typography, proportions, tight kerning, and the iconic red accent on the first hour digit (`#E92828`).

---

## ✨ Key Features

- **Direct Desktop Floating**: Frameless, transparent background with zero window chrome, title bars, borders, cards, or shadows.
- **Iconic OnePlus Visual Hierarchy**: The first digit of the hour is OnePlus Red (`#E92828`); remaining digits are crisp white (or near-black in Light Mode).
- **All 6 OxygenOS Clock Variants**:
  1. **Horizontal**: Large clean `19:30`.
  2. **Vertical**: Stacked `19` / `30` with ultra-tight vertical line spacing (`0.82em`).
  3. **Day + Clock (5×3)**: `Friday` above `19:30`, `October 26` below.
  4. **Clock + Weather Side (5×2)**: `19:30` on left, `☁ 26°` over `Oct 26, Fri` on right.
  5. **Compact (5×2)**: `Oct 26, Fri ☁ 26°` top row, `19:30` bottom row.
  6. **Large Information (5×3)**: `Friday`, `19:30`, `Oct 26 ☁ 26°`.
  7. **Vertical + Weather (5×4)**: `Oct 26, Fri`, `Cloudy ☁ 26°`, stacked `19` / `30`.
- **Desktop Dragging & Multi-Monitor Position Memory**: Smooth native Windows OS dragging without lag or selection boxes. Automatically remembers exact screen coordinates across restarts.
- **Always on Top**: Keeps the clock floating above active desktop applications.
- **Click-Through Mode**: Passes all mouse clicks through to desktop icons, taskbars, and apps beneath the clock.
- **System Tray Integration**: OnePlus-branded notification area tray icon with context menu to toggle Always on Top, toggle Click-Through, open Settings, or Quit.
- **Start with Windows**: Windows Registry Run key integration (`HKCU\Software\Microsoft\Windows\CurrentVersion\Run`).
- **Near-Zero Idle CPU**: Smart time calculation that synchronizes to exact minute boundaries rather than polling intervals.
- **High DPI Crispness**: Scalable vector typography using Plus Jakarta Sans matching OnePlus OxygenOS metrics.

---

## 🚀 How to Run

### Option 1: Standalone Portable Executable
Double-click [`onepluswidget.exe`](file:///c:/Users/tarun/Desktop/Oneplusclock/onepluswidget.exe) directly in the project root folder. No installation, node, or dev server required.

### Option 2: Windows Installer (.exe / .msi)
Run [`onepluswidget-setup.exe`](file:///c:/Users/tarun/Desktop/Oneplusclock/onepluswidget-setup.exe) in the project root, or find the MSI installer at `src-tauri/target/release/bundle/msi/onepluswidget_1.0.0_x64_en-US.msi`.

### Option 3: Launcher Script
Double-click `run.bat` in the project root.

### Option 4: Building for Production
```powershell
npm run tauri build
```
This automatically compiles the frontend into `dist`, inlines the assets into the Rust binary, and outputs both portable executables and Windows installers.

### Option 5: Development Mode (Hot Reloading)
```powershell
npm run tauri dev
```

---

## ⚙️ Controls & Customization

- **Drag Widget**: Click and hold with Left Mouse Button anywhere on the clock or settings modal header to move it freely across monitors.
- **Open Settings**:
  - **Right-Click** anywhere on the clock
  - **Double-Click** anywhere on the clock
  - **Click** the OnePlus Tray Icon in the Windows notification area
- **Clock Styles**: Choose from 7 OnePlus OxygenOS layouts (all rendering Time, Date, and Weather).
- **Auto-start**: Enabled by default to start seamlessly with Windows.
- **Always on Top**: Keeps the clock floating above open desktop windows.
- **Click-Through**: Turn on in Settings so mouse clicks pass through the clock to items underneath. (Click tray icon to toggle off).

---

## 👨‍💻 Credits & Community Notice

- **Built with ❤️ by**: [taruntejaguna](https://www.linkedin.com/in/taruntejaguna)
- **Community Notice**: This is an open-source, fan-made third-party desktop widget created by a passionate OnePlus enthusiast. It is not affiliated with, sponsored by, or endorsed by OnePlus / OnePlus Technology (Shenzhen) Co., Ltd.
