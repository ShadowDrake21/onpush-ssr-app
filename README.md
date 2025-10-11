# OnpushSsrDummyApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.1.

The application was created in order to practice ChangeDetectionStrategy.OnPush and Service-Side Rendering (SSR).

## Quick tutorial

![Quick tutorial](https://github.com/ShadowDrake21/onpush-ssr-app/raw/main/src/assets/readme-gif.gif)

# ⚙️ OnpushSsrDummyApp

**OnpushSsrDummyApp** is an experimental Angular application (generated with **Angular CLI v17.0.1**) built to explore and practice **ChangeDetectionStrategy.OnPush** and **Server-Side Rendering (SSR)** techniques.

---

## 🧠 Purpose

The main goal of this project is to understand how **Angular’s OnPush change detection** interacts with **SSR rendering**.  
It serves as a sandbox environment for developers who want to test Angular performance patterns, data flow, and manual DOM manipulations.

While this app doesn’t aim to solve real-world problems, it demonstrates a variety of fundamental Angular concepts in action.

---

## 🚀 Features

- 🧩 Practice with **ChangeDetectionStrategy.OnPush**
- 🌐 Experiment with **Angular SSR** rendering
- ⚡ Perform **CRUD operations**
- 📡 Fetch and display mock data from APIs
- 🧱 Apply **manual DOM manipulations**
- 🎮 Simple and interactive UI — “just click the buttons 😄”

---

## 🧭 How to Use

Although the app’s main goal is experimental, you can:
1. Launch the development server.
2. Interact with the UI elements to trigger data fetching or mutations.
3. Observe how the app behaves with OnPush strategy enabled.
4. Optionally run the project with SSR enabled to analyze rendering differences.

---

## 🧰 Development

### Run the App Locally
```bash
ng serve
```

Navigate to http://localhost:4200/

The app will automatically reload when you modify source files.

Generate New Components
ng generate component component-name
You can also generate other Angular constructs:

ng generate directive|pipe|service|class|guard|interface|enum|module
Build for Production

ng build
Build artifacts are stored in the dist/ directory.

🧪 Testing
Unit Tests
Run unit tests using Karma:

ng test
End-to-End Tests
Run e2e tests:

ng e2e
Note: You may need to add a package that provides e2e testing capabilities first.

💡 Additional Resources
For more details on Angular CLI commands, visit the official documentation:
👉 Angular CLI Overview and Command Reference

🧩 Future Experiments
Integrate Angular Universal for full SSR setup

Compare OnPush vs Default change detection performance

Add hydration experiments for SSR

Introduce state management via RxJS or NgRx

Analyze server vs client rendering timings

👨‍💻 Author
OnpushSsrDummyApp — a learning playground for developers diving deeper into Angular performance, reactivity, and SSR.

