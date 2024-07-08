let lastRainId;

ping(10000);

function Rain() {
  let socket = new WebSocket(
    "wss://api.rbxgold.com/socket.io/?EIO=4&transport=websocket"
  );
  socket.onopen = function (e) {
    console.log("testestse");
  };
  //
  socket.onmessage = function (event) {
    if (event.data.startsWith("0")) {
      socket.send("40");
    }

    if (event.data.startsWith("40")) {
      socket.send('42["rain-join"]');
    }

    if (event.data.startsWith("2")) {
      socket.send("3");
    }

    // Join

    if (event.data.includes("in progress")) {
      var data = event.data.toString();

      var idStartIndex = data.indexOf("id") + 5;
      var idEndIndex = data.indexOf(",", idStartIndex);
      var id = data.substring(idStartIndex, idEndIndex);
      if (id != lastRainId) {
        lastRainId = id;
        // Ev Amount
        var evStartIndex = data.indexOf("evAmount") + 10;
        var evEndIndex = data.indexOf(".", evStartIndex);
        var evAmountString = data.substring(evStartIndex, evEndIndex);
        console.log(evAmountString);

        // Tip Amount
        var tipStartIndex = data.indexOf("tipAmount") + 11;
        var tipEndIndex;
        if (data.includes("joinedRain")) {
          tipEndIndex = data.indexOf(",", tipStartIndex);
        } else {
          tipEndIndex = data.indexOf("}", tipStartIndex);
        }
        var tipAmountString = data.substring(tipStartIndex, tipEndIndex);

        // Total
        var rainAmount = parseInt(evAmountString) + parseInt(tipAmountString);
        if (rainAmount >= 1) {
          ping(rainAmount);
        }
      }
    }
  };

  socket.onclose = function (event) {
    socket.close();
    Rain();
  };

  socket.onerror = function (error) {
    console.log(`[error]`);
    Rain();
  };

  setInterval(function () {
    socket.send('42["rain-ping"]');
  }, 5000);
}
Rain();

async function ping(rainAmount) {
  rainAmount = new Intl.NumberFormat().format(rainAmount.toString());
  const url =
    "https://discord.com/api/webhooks/1242954539288756227/yiVZ2e4K0ZrnlYokSmMMIz0DgoKd-OGU-jEpBPw4NBGferP_b2eQ_JfdhrFfZFRiMQlY";
  const headers = {
    "Accept": "application/json",
    "Accept-Language": "en",
    "Content-Type": "application/json"
  }
  const body = JSON.stringify({
  "content": "<@&1165009696776790096> https://rbxgold.com",
  "embeds": [
    {
      "title": "Rain on  <:rbxgold:1165009643970502657> **RBXGOLD **<:rbxgold:1165009643970502657>",
      "description": "☂️ **Current rain:** \\n ```R$" + rainAmount + "```",
      "color": 16762625
    }
  ],
  "attachments": []
})

  const response = await fetch(url, { method: 'POST', headers, body });
  const data = await response.json();
  console.log(data);
}
