import { GameApp } from "./GameApp";
import { AppRoot } from "./base/AppRoot";
import { Canvas2D } from "./base/Canvas2D";

console.log("hello world");

let app = new GameApp();
AppRoot.instance = app;

app.run();