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

var items = getCmsItems('648e8ae75ddfea7c1b22e52b', 0, 6);

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
  const res = {
	"items": [
	  {
		"_archived": false,
		"_draft": false,
		"address": "אריה שנקר 49, חולון",
		"status": "הרוס",
		"memory": "<p id=\"\">לכולם היתה העדפה לקולנוע רונה הגדול ואני אהבתי את ארמון הקטן עם ירידה מיוחדת במדרגות בתוך מבנה נישתי. האנרגיה של המקום עשתה חי טוב. אהבתי ללכת לשם</p>",
		"name": "קולנוע ארמון",
		"slug": "qvlnv-rmvn",
		"cover-img": {
		  "fileId": "648e8b21c78f6d7a5c945afd",
		  "url": "https://uploads-ssl.webflow.com/6485e777a325a05fbccaf956/648e8b21c78f6d7a5c945afd_648c214b94aaad449a76091b_%25D7%2591%25D7%25A8%25D7%2590%25D7%2599%25D7%259C%25D7%259F11%25D7%2594%25D7%25A8%25D7%25A6%25D7%259C%25D7%2599%25D7%2594.jpeg",
		  "alt": null
		},
		"updated-on": "2023-06-18T04:42:09.438Z",
		"updated-by": "Person_6485dc26adbde29bba9eeebd",
		"created-on": "2023-06-18T04:42:09.438Z",
		"created-by": "Person_6485dc26adbde29bba9eeebd",
		"published-on": "2023-06-18T05:09:52.680Z",
		"published-by": "Person_6485dc26adbde29bba9eeebd",
		"_cid": "648e8ae75ddfea7c1b22e52b",
		"_id": "648e8b21c78f6d7a5c945b1a"
	  },
	  {
		"_archived": false,
		"_draft": false,
		"address": "רחוב אשכר 2, כפר ורדים (היו שלושה במיקומים שונים בכפר)",
		"status": "הרוס",
		"memory": "<p id=\"\">הבלון הוא מבנה מתנפח שבתוכו היה מגרש עם כיסאות שהיה מקום לשיעורי ספורט ומשחקי כדורסל או טניס. בשבילי הבלון הוא מקום שליווה אותי לאורך הילדות וגיל ההתבגרות. ביליתי בו בשיעורי ספורט בבית ספר היסודי או בחוגי טניס או טניס בשעות אחר הצהריים. זה מקום מזוהה עבור כל ילד מכפר ורדים שגדל בשנות האלפיים המוקדמות.בגלל שהמבנה היה מתנפח אז הוא היה מתרוקן מאוויר ומושבת כשהיה חורף בכפר. ב2012 פינצ_רו והרסו את המבנה לטובת בניית אולם ספורט יציב ועמיד אבל הוא יהיה לי חקוק בלב לנצח.</p>",
		"name": "הבלון",
		"slug": "hblvn",
		"cover-img": {
		  "fileId": "648e8b20dfc7f86e441e59ac",
		  "url": "https://uploads-ssl.webflow.com/6485e777a325a05fbccaf956/648e8b20dfc7f86e441e59ac_648c20237436383f4966c395_%25D7%2594%25D7%2591%25D7%259C%25D7%2595%25D7%259F.jpeg",
		  "alt": null
		},
		"updated-on": "2023-06-18T04:42:09.213Z",
		"updated-by": "Person_6485dc26adbde29bba9eeebd",
		"created-on": "2023-06-18T04:42:09.213Z",
		"created-by": "Person_6485dc26adbde29bba9eeebd",
		"published-on": "2023-06-18T05:09:52.680Z",
		"published-by": "Person_6485dc26adbde29bba9eeebd",
		"_cid": "648e8ae75ddfea7c1b22e52b",
		"_id": "648e8b21dfc7f86e441e59bd"
	  },
	  {
		"_archived": false,
		"_draft": false,
		"address": "המעפילים 31 באר שבע",
		"status": "הרוס",
		"memory": "<p id=\"\">מבנה הליויתן בפארק שמול החוף היה קיים מאז שאני זוכר את עצמי. זה למעשה היה גן המשחקים שגדלנו בו. זה היה גם מבחן בגרות למי יש אומץ לטפס עד למעלה, למי יש אומץ לקפוץ מהזנב וכו'. לידו ערכנו ימי הולדת וידענו שבערב יש בני נוער מתנשקים שם. במהלך השנים הוא עבר מספר שינויים כמו תוספת של מגלשות וסגירת חלק מהפתחים, ולבסוף סגירתו כמזרקת מים עד הריסתו זה הפך את המקום לנוסטלגי מאוד, ויש המתהדרים שהם הכירו את הליויתן כשהוא עדיין היה פתוח או כשעדיין היו לו את המגלשות הכחולות ולא האדומות. לצערי לפני מספר שנים הרסו את הליויתן וכל מה שנותר זה את הגדר הנמוכה שגידרה אותו.</p>",
		"name": "הליויתן בחוף קרית ים",
		"slug": "hlyvytn-bkhvp-qryt-ym",
		"cover-img": {
		  "fileId": "648e8b206cc3ae7809490aa4",
		  "url": "https://uploads-ssl.webflow.com/6485e777a325a05fbccaf956/648e8b206cc3ae7809490aa4_648c1fddc7f143d9a56b7e40_%25D7%2594%25D7%259C%25D7%2599%25D7%2595%25D7%2595%25D7%2599%25D7%25AA%25D7%259F2.jpeg",
		  "alt": null
		},
		"updated-on": "2023-06-18T04:42:09.038Z",
		"updated-by": "Person_6485dc26adbde29bba9eeebd",
		"created-on": "2023-06-18T04:42:09.038Z",
		"created-by": "Person_6485dc26adbde29bba9eeebd",
		"published-on": "2023-06-18T05:09:52.680Z",
		"published-by": "Person_6485dc26adbde29bba9eeebd",
		"_cid": "648e8ae75ddfea7c1b22e52b",
		"_id": "648e8b216cc3ae7809490acf"
	  },
	  {
		"_archived": false,
		"_draft": false,
		"address": "פארק אינשטיין קרית ים",
		"status": "קיים ופעיל",
		"memory": "<p id=\"\">דפנה 46 היה הבניין בו גרתי, ברמת העיקרון הבניין עצמו היווה נקודת מפגש של כל החברים יום ביומו בבלוק של הבניין. היינו משחקים בחצר ובחנייה, היינו משתמשים בפירות של עצי הדקל מסביב בתור תחמושת בקרבות, בשדה מאחורי הבניין ובביניים מסביב למשחקי מחבואים ושוטרים וגנבים, ואפילו ניהלנו שם טורנירים של טריוויה, היינו לומדים למבחנים ומשננים טקסטים להצגות במקלט של הבניין, משמשים במערכת ההשקייה של הבניין בתור המצבור שלנו במלחמות מים. בעיקרון הבלוק היווה נקודת מפגש חברתית מרכזית בעבורנו ואותם ילדים שהיו איתי בבלוק נשארו איתי עד היום - (רגב, אורן, ציפרוט, אביב ועמרי..אגטו על תעלב אבל מבחינתי עד יב' היית חייזר שגר בקרטון)</p>",
		"name": "דפנה 46",
		"slug": "dpnh-46",
		"cover-img": {
		  "fileId": "648e8b2037a299c95b1f2275",
		  "url": "https://uploads-ssl.webflow.com/6485e777a325a05fbccaf956/648e8b2037a299c95b1f2275_648c2003d9fa498a8b5af0f5_%25D7%2593%25D7%25A4%25D7%25A0%25D7%259446%25D7%25A7%25D7%25912.jpeg",
		  "alt": null
		},
		"updated-on": "2023-06-18T04:42:08.494Z",
		"updated-by": "Person_6485dc26adbde29bba9eeebd",
		"created-on": "2023-06-18T04:42:08.494Z",
		"created-by": "Person_6485dc26adbde29bba9eeebd",
		"published-on": "2023-06-18T05:09:52.680Z",
		"published-by": "Person_6485dc26adbde29bba9eeebd",
		"_cid": "648e8ae75ddfea7c1b22e52b",
		"_id": "648e8b2037a299c95b1f2286"
	  },
	  {
		"_archived": false,
		"_draft": false,
		"address": "גרשון אגרון 24, ירושלים",
		"status": "קיים ופעיל",
		"memory": "<p id=\"\">שם הכרתי את החברה שלי. היא הגיעה עם אחד החברים שלה וחשבתי שהם היו זוג. אז דיברתי בעיקר איתו והיא ניסתה להיכנס לשיחה. בסוף הלילה הבנתי שהם לא היו זוג וביקשתי את המספר שלה. אנחנו עכשיו ביחד 4.5 שנים.</p>",
		"name": "הגלן - בר וויסקי",
		"slug": "hgln-br-vvysqy",
		"cover-img": {
		  "fileId": "648e8b20e9a6feeb6fee09ae",
		  "url": "https://uploads-ssl.webflow.com/6485e777a325a05fbccaf956/648e8b20e9a6feeb6fee09ae_648c208e2acf21f4e3cfc08a_%25D7%2592%25D7%2591%25D7%25A2%25D7%25AA%25D7%2594%25D7%25A2%25D7%259E%25D7%2593%25D7%2595%25D7%25AA2.jpeg",
		  "alt": null
		},
		"updated-on": "2023-06-18T04:42:08.439Z",
		"updated-by": "Person_6485dc26adbde29bba9eeebd",
		"created-on": "2023-06-18T04:42:08.439Z",
		"created-by": "Person_6485dc26adbde29bba9eeebd",
		"published-on": "2023-06-18T05:09:52.680Z",
		"published-by": "Person_6485dc26adbde29bba9eeebd",
		"_cid": "648e8ae75ddfea7c1b22e52b",
		"_id": "648e8b20e9a6feeb6fee09b2"
	  },
	  {
		"_archived": false,
		"_draft": false,
		"address": "דפנה 46, קרית ביאליק",
		"status": "נטוש",
		"memory": "<p id=\"\">זה היה הקולנוע השכונתי שנמצא בתוך מרכז מסחרי, יכולנו להגיע לקולנוע ברגל או בנסיעה של 3,4 תחנות באוטובוס. הוא היה נקודת ציון. ראינו בו סרטי ילדות והיה לו מבנה מאוד מיוחד הם הגגות המשלושים והצבע הכחול. הרצפה שלו היתה באלכסון ואם נפל משהו כמו בקבוק שתיה הוא היה מתגלגל עד שנתקי בבמה שעליה פרוש המסך. אם אני לא טועה בגג היו חורים מהם נכנס אור . בשלב מסוים נסגרו בתי הקולנוע השכונתיים זה אחר זה והוא עומד נטוש לדעתי עד היום שנים שימש כמאורת סמים ושנים דברו על כך שימכרו את השטח לטובת בניית רב קומות. לדעתי הוא עדיין שם ...</p>",
		"name": "קולנוע אורות באר שבע",
		"slug": "qvlnv-vrvt-br-shb",
		"cover-img": {
		  "fileId": "648e8b20dfc7f86e441e5977",
		  "url": "https://uploads-ssl.webflow.com/6485e777a325a05fbccaf956/648e8b20dfc7f86e441e5977_648c2171b8051c4354160b7f_%25D7%2591%25D7%2599%25D7%25AA%25D7%25A8%25D7%2595%25D7%25A7%25D7%25A12.jpeg",
		  "alt": null
		},
		"updated-on": "2023-06-18T04:42:08.414Z",
		"updated-by": "Person_6485dc26adbde29bba9eeebd",
		"created-on": "2023-06-18T04:42:08.414Z",
		"created-by": "Person_6485dc26adbde29bba9eeebd",
		"published-on": "2023-06-18T05:09:52.680Z",
		"published-by": "Person_6485dc26adbde29bba9eeebd",
		"_cid": "648e8ae75ddfea7c1b22e52b",
		"_id": "648e8b20dfc7f86e441e597d"
	  },
	  {
		"_archived": false,
		"_draft": false,
		"address": "בן עמי 16, תל אביב",
		"status": "קיים ופעיל",
		"memory": "<p id=\"\">אבא שלי שחקן טניס חובב שבכל שנה יורד לאילת לטורניר טניס שמתקיים אחת לשנה. את הטורניר מארח מלון ספורט שבאילת. כל שנה נהגנו לרדת בנובמבר לאילת- אבא שלי שיחק וכל המשפחה בילתה</p>",
		"name": "מלון ספורט",
		"slug": "mlvn-spvrt",
		"cover-img": {
		  "fileId": "648e8b2034f6ea7a02a4f56d",
		  "url": "https://uploads-ssl.webflow.com/6485e777a325a05fbccaf956/648e8b2034f6ea7a02a4f56d_648c2056dfbfa21a1a375ce0_%25D7%2594%25D7%2591%25D7%2599%25D7%25AA%25D7%25A9%25D7%259C%25D7%25A1%25D7%2591%25D7%25AA%25D7%25902.jpeg",
		  "alt": null
		},
		"updated-on": "2023-06-18T04:42:08.407Z",
		"updated-by": "Person_6485dc26adbde29bba9eeebd",
		"created-on": "2023-06-18T04:42:08.407Z",
		"created-by": "Person_6485dc26adbde29bba9eeebd",
		"published-on": "2023-06-18T05:09:52.680Z",
		"published-by": "Person_6485dc26adbde29bba9eeebd",
		"_cid": "648e8ae75ddfea7c1b22e52b",
		"_id": "648e8b2034f6ea7a02a4f593"
	  },
	  {
		"_archived": false,
		"_draft": false,
		"address": "דרך הים, אילת",
		"status": "קיים ופעיל",
		"memory": "<p id=\"\">הקניון הזה היה הרבה דברים בשבילי, כי הוא היה ממש הדבר הכיי קרוב למקום בילוי שהיה לידנו בתור ילדים. ראיתי שם בקולנוע (שאין כבר) את הארי פוטר והנסיך מאזקבאן, חגגנו יום הולדת לי ולאחותי עם להקת בובות פרוותיוית רובוטיות בגודל אנושי (שהייתה קבועה במתחם האירועים של הקניון), יצאתי למקדונלדס עם חברים (שכמובן שהחבורה המתחרה שלנו הייתה פרלמנט זקנים שיושבים על 7 מים ו1 גלידה בגביע), בצופים התרמתי בקופות של הסופר מוצריי מזון לנזקקים ועוד ועוד. אבל הזיכרון הכי משמעותיי שלי הוא שאחריי שההוריים שלי התגרשו, היינו מתראות עם אבא שלנו כל יום רביעי אחרי הבית ספר. ובאופן קבוע היינו מגיעים ישר למקדונלדס של קניון אלרם. ואיכשהו המקדונלדס הספציפיי הזה, שבקניון אלרם, הרגיש כמו נחמה לכולנו.</p>",
		"name": "קניון אלרם",
		"slug": "qnyvn-lrm",
		"cover-img": {
		  "fileId": "648e8b1f9ae84f3d53f37ecc",
		  "url": "https://uploads-ssl.webflow.com/6485e777a325a05fbccaf956/648e8b1f9ae84f3d53f37ecc_648c206590d3b765fd0ad888_%25D7%2594%25D7%2590%25D7%2595%25D7%2596%25D7%259F%25D7%2594%25D7%25A9%25D7%259C%25D7%2599%25D7%25A9%25D7%2599%25D7%25AA.jpeg",
		  "alt": null
		},
		"updated-on": "2023-06-18T04:42:08.183Z",
		"updated-by": "Person_6485dc26adbde29bba9eeebd",
		"created-on": "2023-06-18T04:42:08.183Z",
		"created-by": "Person_6485dc26adbde29bba9eeebd",
		"published-on": "2023-06-18T05:09:52.680Z",
		"published-by": "Person_6485dc26adbde29bba9eeebd",
		"_cid": "648e8ae75ddfea7c1b22e52b",
		"_id": "648e8b209ae84f3d53f37ed8"
	  },
	  {
		"_archived": false,
		"_draft": false,
		"address": "ביאליק 76, רמת גן",
		"status": "קיים ופעיל",
		"memory": "<p id=\"\">היינו הולכים במשך שנים, אבא שלי אחותי ואני, לצפות בסרטים יחד ברב חן דיזינגוף. איכשהו התחושה של קולנוע שעומד בפני עצמו, ולא מתחזה למשהו אחר, הרגישה ממש קסומה והעצימה את החוויה. האולמות או ענקיים, או קטנטנים, יש בסך הכל 4 מהם לדעתי. כל ה2 מאבטחים הכירו אותנו טוב טוב, ואם חלילה ראו מישהו מאיתנו בלי השניים האחרים מיד שאלו לשלומו.</p>",
		"name": "רב חן דיזינגוף",
		"slug": "rb-khn-dyzyngvp",
		"cover-img": {
		  "fileId": "648e8b1fb2f7e61acaa4a8d9",
		  "url": "https://uploads-ssl.webflow.com/6485e777a325a05fbccaf956/648e8b1fb2f7e61acaa4a8d9_648c2119c8b1fb04010f916f_%25D7%2591%25D7%259C%25D7%2595%25D7%259E%25D7%25A4%25D7%2599%25D7%259C%25D7%25933.jpeg",
		  "alt": null
		},
		"updated-on": "2023-06-18T04:42:08.113Z",
		"updated-by": "Person_6485dc26adbde29bba9eeebd",
		"created-on": "2023-06-18T04:42:08.113Z",
		"created-by": "Person_6485dc26adbde29bba9eeebd",
		"published-on": "2023-06-18T05:09:52.680Z",
		"published-by": "Person_6485dc26adbde29bba9eeebd",
		"_cid": "648e8ae75ddfea7c1b22e52b",
		"_id": "648e8b20b2f7e61acaa4a909"
	  }
	],
	"count": 9,
	"limit": 10,
	"offset": 0,
	"total": 9
  };
  return res;
}
