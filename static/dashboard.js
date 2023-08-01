console.log("Hello World!")

fetch('https://sheetdb.io/api/v1/78uve0w4nrmgo')
  .then(response => response.json())
  .then(data => {
    console.log(data)
    let container = document.querySelector('.knowledgeTitle')
    
    data.forEach(row => {
      let stringData = JSON.stringify(row["question"])
      let rowElement = document.createElement('p')
      rowElement.textContent = stringData;
      container.appendChild(rowElement)
      let button = document.createElement('button')
      button.setAttribute('class', 'btn btn-primary text-center mb-2')
      button.setAttribute('id', stringData.split(' ').join(''))
      button.innerText = "tryItOut"
      container.appendChild(button)
      button.addEventListener('onclick', alert(`Question: ${button.id}`))
    })
  })
  .catch(error => console.log('Error', error))

 