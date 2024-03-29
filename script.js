let lastRainId;

function Rain() {
  let socket = new WebSocket("wss://api.runestake.com/socket.io/?EIO=4&transport=websocket");
  socket.onopen = function(e) {
    console.log("testestse");
  };
  //
  socket.onmessage = function(event) {
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
        }
        else {
          tipEndIndex = data.indexOf("}", tipStartIndex);
        }
        var tipAmountString = data.substring(tipStartIndex, tipEndIndex);

z
        // Date
        var dateStartIndex = data.indexOf("endDate") + 9;
        var dateEndIndex = data.indexOf("Z", dateStartIndex);
        var endDate = data.substring(dateStartIndex, dateEndIndex);
        // Total
        var rainAmount = parseInt(evAmountString) + parseInt(tipAmountString);
        if (rainAmount >= 100) {
          ping(rainAmount, endDate);
        }


      }

    }
  };

  socket.onclose = function(event) {
    socket.close();
    Rain();
  };

  socket.onerror = function(error) {
    console.log(`[error]`);
    Rain();
  };

  setInterval(function() {
    socket.send('42["rain-ping"]');
  }, 5000);
}
Rain();

async function ping(rainAmount, endDate) {
  rainAmount = new Intl.NumberFormat().format(rainAmount.toString());
  const url = "https://discord.com/api/webhooks/1188423625397780510/dnCV3hBdWMFJ0BtesNLngByxwKt18KeBwL1xnMKMD5boq-gv7k3A_lp5CeAfpbtmB_BY";
  endDate = Date.parse(endDate) / 1000;
  const headers = {
    "Accept": "application/json",
    "Accept-Language": "en",
    "Content-Type": "application/json"
  }
  const body = JSON.stringify({
    "content": "<@&1166800262938243193> https://runestake.com",
    "embeds": [
      {
        "title": "Rain on  <:runestake:1167096407958753402> **RUNESTAKE **<:runestake:1167096407958753402>",
        "description": "☂️ **Current rain:** \n```" + rainAmount + "```",
        "color": 16762625
      }
    ],
    "attachments": []
  })

  const response = await fetch(url, { method: 'POST', headers, body });
  const data = await response.json();
  console.log(data);


}
