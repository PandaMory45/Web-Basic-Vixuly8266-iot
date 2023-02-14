
// Chart------

//--DataSensor .On from Server


let chartLimit = 15;
const ctx = document.getElementById('ssChart').getContext('2d');
const data = {
	labels: [],
	datasets: [
		{
			type: 'bar',
			label: 'Temp',
			yAxisID: 'A',
			data: [],
			borderColor: 'rgba(215, 0, 0, 0.899)',
			backgroundColor: 'rgba(215, 0, 0, 0.899)',
		},
		{
			type: 'bar',
			label: 'Humi',
			yAxisID: 'A',
			data: [],
			borderColor: 'rgba(15, 6, 139, 0.9)',
			backgroundColor: 'rgba(15, 6, 139, 0.9)',
		},
		{
			type: 'line',
			label: 'Light',
			yAxisID: 'B',
			data: [],
			backgroundColor: 'rgba(252, 186, 3, 0.9)',
			borderColor: 'rgba(252, 186, 3, 0.9)',
		},
	],
};

Chart.defaults.color = '#000';
const ssChart = new Chart(ctx, {
	type: 'scatter',
	data: data,
	options: {
		responsive: true,
		maintainAspectRatio: false,
		showTooltips: true,
		interaction: {
			intersect: true,
			mode: 'index',
		},
		plugins: {
			title: {
				display: true,
				text: 'Data Chart',
			},
			tooltip: {
				enabled: true,
				callbacks: {
					title: function (ctx) {
						return ctx[0].label;
					},
					label: function (ctx) {
						let label = ctx.dataset.label || '';

						if (label) label += ': ';
						if (ctx.parsed.y !== null) label += ctx.parsed.y;
						return label;
					},
				},
			},
		},
		scales: {
			A: {
				type: 'linear',
				position: 'left',
				max: 100,
			},
			B: {
				type: 'linear',
				position: 'right',
				min: 0,
			},
		},
	},
});

// // Update data
function updateData(temp, humi, light, updated_at) {
	let t = document.getElementById('temp');
	let h = document.getElementById('hum');
	let l = document.getElementById('light');
	let time = updated_at;

	t.innerText = `${temp}℃`;
	h.innerText = `${humi}%`;
	l.innerText = `${light} lux`;

//
	if (ssChart.data.labels.length > chartLimit - 1) {
		ssChart.data.labels.shift();
		ssChart.data.datasets[0].data.shift();
		ssChart.data.datasets[1].data.shift();
		ssChart.data.datasets[2].data.shift();
	}

	// Push data 
	ssChart.data.labels.push(time);
	ssChart.data.datasets[0].data.push(temp);
	ssChart.data.datasets[1].data.push(humi);
	ssChart.data.datasets[2].data.push(light);
	ssChart.update();
}
socket.on('sensors', (msg) => {
	updateData(msg.temp, msg.humi, msg.light, msg.updated_at); //nhận data từ server
});

//Button .EMIT SERVER
//Button 1 
let btn1 = document.getElementById('btn1');
let tog = document.getElementById('tog_btn1');

let dem = 1;
let open = './img/open.png'
let close = './img/close.png'
tog.onclick = function() {

      tog.classList.toggle('change_bg');
      btn1.classList.toggle('change_bg');
      if (dem == 1){
          if(confirm('bat den?') == true){
              document.getElementById("lamp_open").src = open;
              dem --;
              socket.emit('DEVICE1', '0');
          }
      }
      else{
          if(confirm('tat den?') == true){
              document.getElementById("lamp_open").src = close;
              dem ++;
              socket.emit('DEVICE1', '1');
              }
          }
      }

//button 2

function device2() {
	if (btn2.innerText == "ON") {
	  socket.emit("DEVICE2", "0");
	  btn2.innerText = "OFF";
	  btn2.classList.remove("btn-success");
	  btn2.classList.add("btn-danger");
	  document.getElementById("lamp_open2").src = open;
	  // document.getElementById("bgbtn2").style.backgroundColor = "red";
	} else {
	  socket.emit("DEVICE2", "1");
	  btn2.innerText = "ON";
	  btn2.classList.remove("btn-danger");
	  btn2.classList.add("btn-success");
	  document.getElementById("lamp_open2").src = close;
	  // document.getElementById("bgbtn2").style.backgroundColor = "rgba(0, 0, 0, 0.82)";
	}
  }


// if (`${light}` > 0 && `${light}`< 1500) {
	// 	document.getElementById("LightBG").style.background = "#ffff33";
	//   }
	//   if (`${light}` > 1500 && `${light}`< 2000) {
	// 	document.getElementById("LightBG").style.background = "rgba(252, 186, 3, 0.9)";
	//   }
	//   if (`${light}` > 2000 && `${light}`< 3000) {
	// 	document.getElementById("LightBG").style.background = "#e6e600";
	//   }
	// xóa data đâu tiên đi khi dât vượt quá 15