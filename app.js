(function(){
  const readerEl = document.getElementById("qr-reader"),
        btnScan   = document.getElementById("btn-scan"),
        caixa     = document.getElementById("caixa-template"),
        slider    = document.getElementById("volume-slider"),
        label     = document.getElementById("volume-label"),
        boxIdSpan = document.getElementById("box-id");
  let qrReader;

  btnScan.addEventListener("click", () => {
    btnScan.disabled = true;
    readerEl.style.display = "block";
    qrReader = new Html5Qrcode("qr-reader");
    qrReader.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      decoded => {
        qrReader.stop();
        readerEl.style.display = "none";
        const boxId = decoded.trim();
        boxIdSpan.textContent = boxId;
        caixa.style.display = "block";
      },
      _err => {}
    ).catch(console.error);
  });

  slider.addEventListener("input", () => {
    label.textContent = slider.value;
  });

  slider.addEventListener("change", () => {
    fetch("/api/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id:      boxIdSpan.textContent,
        volume:  slider.value
      })
    })
    .then(r => r.text())
    .then(msg => alert("Sucesso: " + msg))
    .catch(e => alert("Erro: " + e));
  });
})();
