const stkn = '<token>';

// var items = getCmsItems('64a26bea7b774d01d189a452', 0, 99);

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
				console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    return resp;
}
