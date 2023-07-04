// Create the realm with 100 panels
const numPanels = 10;
const panelDistanceX = 1.5;
const panelDistanceZ = 2;
const panelWidth = 1;
const panelHeight = (16/9) * panelWidth;
const panelBase = 0.1;
const columnSize = 2;
const cameraZ = 3;
const rowsSize = Math.floor(numPanels / columnSize);
const blendZ = cameraZ - panelDistanceZ * 0.25;
const minZ =  blendZ - panelDistanceZ * 0.25;
const maxZ = cameraZ + panelDistanceZ * (rowsSize + 0.25);
const contDomElement = document.body;
var canvasSize = {x: contDomElement.clientWidth, y:contDomElement.clientHeight };
const textureLoader = new THREE.TextureLoader();
THREE.Cache.enabled = true;

var items = getCmsItems('64a26bea7b774d01d189a452', 0, 99);

// Create the Three.js scene, camera, and renderer
const scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0x0, 5, 10 );
// scene.fog = new THREE.FogExp2( 0x202020, 0.1 );
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 10000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener('resize', handleResize, false);

// Create an array to store the panels
const rows = [];

for (let r = 0; r < rowsSize; r++) {
	const row = [];
	for (let c = 0; c < columnSize; c++) {
		const geometry = new THREE.PlaneGeometry(panelWidth, panelHeight);
		const material = new THREE.MeshBasicMaterial({ 
			color: Math.random() * 0xffffff,
			transparent: true, opacity: 1.0 });
		const panel = new THREE.Mesh(geometry, material);

		const x = c * panelDistanceX * 2 - panelDistanceX * (columnSize - 1) + panelDistanceX * 1.5 * (Math.random() - 0.5);
		const z = -r * panelDistanceZ;
		panel.rowIndex = r;
		panel.colIndex = c;
		panel.userIndex = r * columnSize + c;
		panel.position.set(x, panelBase, z);
		setImagePicture(panel);
		// panel.material.opacity = (rowsSize - panel.rowIndex) / rowsSize;
		// Add the panel to the scene
		scene.add(panel);
		row.push(panel);
	}
	rows.push(row);
}

// Set up controls to navigate through the panels
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = false; // Disable zooming

// Set initial camera position
camera.position.set(0, 0.3, cameraZ);
camera.lookAt(0, 0, 0);

// Event listener for mouse wheel
document.addEventListener('wheel', handleMouseWheel);

// Mouse wheel event handler
function handleMouseWheel(event) {
  const delta = Math.sign(event.deltaY);
  const moveDistance = panelDistanceZ * delta / 12;

//   camera.translateZ( - moveDistance );

//   Move the panels in the direction of the mouse wheel
  rows.forEach(r => {
	r.forEach(panel => {
		panel.position.z += moveDistance;
		const dist = cameraZ - panel.position.z;
		if (dist > maxZ) {
			panel.position.z += rows.length * panelDistanceZ;
			panel.rowIndex -= rows.length;
			panel.userIndex -= numPanels;
			// panel.material.opacity = (rowsSize - panel.rowIndex) / rowsSize;
			const x = panel.colIndex * panelDistanceX * 2 - panelDistanceX * (columnSize - 1) + panelDistanceX * 1.5 * (Math.random() - 0.5);
			setImagePicture(panel);
		} else if (dist < blendZ) {
				panel.material.opacity = (dist - minZ) / (blendZ - minZ);
				if (dist < minZ) {
				panel.position.z -= rows.length * panelDistanceZ;
				panel.rowIndex += rows.length;
				panel.userIndex += numPanels;
				const x = panel.colIndex * panelDistanceX * 2 - panelDistanceX * (columnSize - 1) + panelDistanceX * 1.5 * (Math.random() - 0.5);
				setImagePicture(panel);
				panel.material.opacity = 1;
			}
		}
	})
  });
}

function handleResize(event) {
  canvasSize = {x: contDomElement.clientWidth, y:contDomElement.clientHeight };
  camera.aspect = canvasSize.x / canvasSize.y;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasSize.x, canvasSize.y);
}

// Render loop
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Update controls in each frame
  renderer.render(scene, camera);
}
animate();

function setImagePicture(panel) {
	const imageIndex = (1000*items.items.length + panel.userIndex) % items.items.length;
	if (!panel.imageIndex || panel.imageIndex != imageIndex) {
		panel.imageIndex = imageIndex;
		const imagePath = items.items[imageIndex]["cover-img"].url;
		panel.imagePath = imagePath;
		textureLoader.load(imagePath, function(image) {
			const imageMaterial = new THREE.MeshBasicMaterial({
			map: textureLoader.load(imagePath),
			transparent: true, opacity: 1.0,
			side: THREE.FrontSide
			});
			panel.material = imageMaterial;
		});
	}
}

function getCmsItems(id, offset, count) {
	var resp = {};
    const apiUrl = `https://api.webflow.com/collections/${id}/items?offset=${offset}&limit=${count}`;
    const headers = {
      'Access-Control-Allow-Origin': 'https://api.webflow.com',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + stkn
    };

    // const params = {
    //     offset: offset,
    //     limit: count
    // };

    const requestOptions = {
      method: 'GET', // HTTP method (GET, POST, PUT, etc.)
      // body: JSON.stringify(params), // Convert params to JSON string
      headers: headers
    };

    fetch(apiUrl, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        resp = response.json();
		console.log(`Read successful with ${resp.items.length} items`);
		return resp;
      })
      .then(data => {
        // Handle the JSON response
        // console.log(data);
        // Use the data as needed
      })
      .catch(error => {
        console.error('Error:', error);
      });

    return resp;
}