import MyApp from "app/MyApp";


(async () => {
    await new MyApp().start(process.env.PORT || 3000);
    console.log("⚡️ Bolt app is running!");
})();
