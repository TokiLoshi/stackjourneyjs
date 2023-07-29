console.log("Hello World!")

fetch('https://sheetdb.io/api/v1/78uve0w4nrmgo')
  .then(response => response.json())
  .then(data => {
    console.log(data)
    let container = document.querySelector('#knowledge')
    data.forEach(row => {
      let rowElement = document.createElement('p')
      rowElement.innerText = JSON.stringify(row);
      container.append(rowElement)
    })
  })
  .catch(error => console.log('Error', error))
 