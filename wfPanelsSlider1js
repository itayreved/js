// Create the Three.js scene, camera, and renderer
const scene = new THREE.Scene();
scene.fog = new THREE.Fog( fogColor, fogNear, fogFar );
// scene.fog = new THREE.FogExp2( 0x202020, 0.1 );
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 10000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener('resize', handleResize, false);

// Create an array to store the panels
const rows = [];

function initPanels() {
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

	// Event listeners for mouse
	document.addEventListener('wheel', handleMouseWheel);
	document.addEventListener('mouseup', handleMouseUp);
	document.addEventListener('mousemove', handleMouseMove);
	setInterval(updatePosition, 30);
}
// Mouse wheel event handler
function handleMouseWheel(event) {
  const delta = Math.sign(event.deltaY);
  zMoveSpeed += (zMoveAccel * delta / 12);
  zMoveSpeed = Math.max(-zMoveMaxSpeed, Math.min(zMoveSpeed, zMoveMaxSpeed));
}

 // Mouse wheel event handler
function updatePosition() {
	if (zMoveSpeed == 0) {
	return;
  }
//   const moveDistance = panelDistanceZ * delta / 12;
  const moveDistance = panelDistanceZ * zMoveSpeed;
  zMoveSpeed *= (1 - zMoveDrag);
  if (zMoveSpeed*zMoveSpeed < zMoveMinSpeed*zMoveMinSpeed) {
	zMoveSpeed = 0;
  }
  
//   camera.translateZ( - moveDistance );

//   Move the panels in the direction of the mouse wheel
  rows.forEach(r => {
	r.forEach(panel => {
		panel.position.z += moveDistance;
		var dist = cameraZ - panel.position.z;
		if (dist > maxZ) {
			// panel.position.z += rows.length * panelDistanceZ;
			panel.position.z += rowsSize * panelDistanceZ;
			dist = cameraZ - panel.position.z;
			panel.rowIndex -= rows.length;
			panel.userIndex -= numPanels;
			// panel.material.opacity = (rowsSize - panel.rowIndex) / rowsSize;
			const x = panel.colIndex * panelDistanceX * 2 - panelDistanceX * (columnSize - 1) + panelDistanceX * 1.5 * (Math.random() - 0.5);
			setImagePicture(panel);
		}
		if (dist < blendZ) {
			panel.material.opacity = (dist - minZ) / (blendZ - minZ);
			if (dist < minZ) {
				// panel.position.z -= rows.length * panelDistanceZ;
				panel.position.z -= rowsSize * panelDistanceZ;
				panel.rowIndex += rows.length;
				panel.userIndex += numPanels;
				const x = panel.colIndex * panelDistanceX * 2 - panelDistanceX * (columnSize - 1) + panelDistanceX * 1.5 * (Math.random() - 0.5);
				setImagePicture(panel);
				panel.material.opacity = 1;
			}
		}
	})
  });

  handleMouseMove();
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
	const imageIndex = (1000*items.length + panel.userIndex) % items.length;
	if (!panel.imageIndex || panel.imageIndex != imageIndex) {
		panel.imageIndex = imageIndex;
		for (var f in items[imageIndex]) {
			panel[f] = items[imageIndex][f];
		}
		// const imagePath = items[imageIndex].image;
		// panel.imagePath = imagePath;
		// panel.text = items[imageIndex].text;
		textureLoader.load(panel.panelImage, function(image) {
			const imageMaterial = new THREE.MeshBasicMaterial({
			map: image,
			transparent: true, opacity: 1.0,
			side: THREE.FrontSide
			});
			panel.material = imageMaterial;
		});
	}
}

//	parameters: initial list, items-prefix, container-class, objext with fld:item-class pairs.
function getItemsFromContainer(init, userParam, containerClass, valueClassObj) {
  var items = [].concat(init);
  var i = 0;
  $(containerClass).each(function() {
	var item = {};
	for (let key in valueClassObj) {
		const elem = $(this).find(valueClassObj[key]);
		var txtval = null;
    	var imgval = null;
		var attr = null;
		$(elem).each( (inx, e) => {
			txtval = txtval || $(e).text();
    		imgval = imgval || $(e).attr('src');
			attr = attr || e.getAttribute('slug');
		})
		const val = attr || imgval || txtval;
		item[key] = val;
	}
	item.userParam = userParam;
	i++;
	console.debug(i, item);
    items.push(item);
  });  
  console.log(`Got ${items.length} items`);
  return items;
}

function handleMouseUp(event) {
	var obj = getItersectedItem(event);
	if (obj) {
		const baseUrl = "/"+ obj.userParam + "/";
		const url = baseUrl + obj.slug;
		console.log(`Jumping to: ${url}`);
		window.location.href = url;
	}
}

function convertToSlug(Text) {
  return Text.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

function setTitle(elem, value) {
	if (! elem) return;
	if (value && value.length > 0) {
		$(elem).text(value);
		$(elem).css({'transition-duration': '0.1s'});
		$(elem).css({opacity: '1'});
	} else {
		$(elem).css({'transition-duration': '0.5s'});
		$(elem).css({opacity: '0'});
	}
}

function handleMouseMove(event) {
	var obj = getItersectedItem(event);
	if (obj) {
		if (obj !== lastHoveredObject) {
			console.log(`Hovered ${obj.id} userIdx=${obj.userIndex} name=${obj.text}`);
			lastHoveredObject = obj;
			setTitle(titleElement, obj.text);
		}
	} else if (lastHoveredObject) {
		console.log(`Off ${lastHoveredObject.id}`);
		lastHoveredObject = null;
		setTitle(titleElement, "");
	}
	// console.log(obj);
}

function getItersectedItem(event) {
	// Calculate mouse position in normalized device coordinates
	var mouse;
	if (event) {
		mouse = new THREE.Vector2();
		mouse.x = (event.offsetX / contDomElement.clientWidth) * 2 - 1;
		mouse.y = -(event.offsetY / contDomElement.clientHeight) * 2 + 1;
		lastMousePos = mouse;
	} else {
		mouse = lastMousePos;
	}
	// Create a raycaster
	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mouse, camera);
	// Find intersecting objects
	const intersects = raycaster.intersectObjects(scene.children, false);
	// Check if any object was clicked
	if (intersects.length > 0) {
		const itersectedObj = intersects[0].object;
		return itersectedObj;
	}
	return null;
}
