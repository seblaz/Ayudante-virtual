import AyudanteVirtual from "app/AyudanteVirtual";


(async () => {
    await new AyudanteVirtual().start(process.env.PORT || 3000);
    console.log("⚡️ Bolt app is running!");
})();
