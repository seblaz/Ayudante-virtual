import AyudanteVirtual from "app/AyudanteVirtual";
import exitHook from "exit-hook";


(async () => {
    const ayudante = new AyudanteVirtual();
    await ayudante.start(process.env.PORT || 3000);

    console.log("⚡️ Bolt app is running!");

    exitHook(async () => {
        console.log("Exiting...");
        await ayudante.stop();
    })
})();
