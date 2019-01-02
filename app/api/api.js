

export function api_call(token) {
    console.log(token)
    const response = fetch(url, {
        method: 'GET',
        headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,        
      }) 
    })
    .then(res => {
        console.log("we have a res")
        console.log(res.json())
    })
    .then(data => {
        console.log(data);
        //this.setState({ data: data })
        return data
    })
    .catch((error) => {
        console.error(error);
    });
}    

