document.addEventListener('DOMContentLoaded', function () {
  const classSelector = document.querySelector('.class-selector');
  classSelector.addEventListener('change', function (event) {
    const selectedClass = event.target.value;
    fetchStudents(selectedClass);
  });

  // Buscar os alunos da classe selecionada inicialmente
  fetchStudents(classSelector.value);

});

function fetchStudents(selectedClass) {
  const sheetName = selectedClass.replace(/ /g, '');
  fetch(`http://localhost:3000/students/${sheetName}`)
    .then((response) => response.json())
    .then((students) => {
      students = loadProgress(students);  // Carregar a ordem salva
      displayStudents(students);
    })
    .catch((error) => console.error('Erro ao buscar alunos, PROVAVEL TABELA NAO EXISTENTE', error));
}


const sendButton = document.getElementById('sendButton');
const cancelButton = document.getElementById('cancelButton');

sendButton.addEventListener('click', sendEmail);

function sendEmail() {
  // Obter os valores dos campos de input
  const email = document.getElementById('nameInput').value;
  const assunto = document.getElementById('subjectInput').value;
  const arquivo = document.getElementById('fileInput').files[0];

  // Criar um objeto FormData para enviar os dados do formulário
  const formData = new FormData();
  formData.append('email', email);
  formData.append('assunto', assunto);
  formData.append('arquivo', arquivo);

  // Exibir o indicador de carregamento
 

  fetch('http://localhost:3000/enviar-email', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
     
      
      alert(data.message);
    })
    .catch((error) => {
     
      
      console.error('Erro ao enviar email:', error);
    });
}

cancelButton.addEventListener('click', () => {
  // Fechar o modal e limpar os campos de input
  document.getElementById('sendModal').style.display = 'none';
  document.getElementById('nameInput').value = '';
  document.getElementById('subjectInput').value = '';
  document.getElementById('fileInput').value = '';
});



// ... (o restante do seu código JavaScript)

saveButton.addEventListener('click', () => {
    takeScreenshot();
 
});


  const closeAlert = document.getElementById("closeAlert");
closeAlert.addEventListener("click", function () {
  const customAlert = document.getElementById("customAlert");
  customAlert.style.display = "none";
});


function takeScreenshot() {
  html2canvas(studentsArea).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const screenshot = document.getElementById("screenshot");
    const customAlert = document.getElementById("customAlert");
    const downloadLink = document.getElementById("downloadLink");
    downloadLink.addEventListener("click", handleDownloadClick);

    screenshot.src = imgData;

    customAlert.style.display = "block";

    downloadLink.href = imgData;

  });
}

const sheets = document.getElementById("sheets");
sheets.addEventListener("click", abrirPlanilha);

const downloadLink = document.getElementById("downloadLink");
downloadLink.addEventListener("click", handleDownloadClick);

function handleDownloadClick() {
  setTimeout(() => {
    const sendModal = document.getElementById("sendModal");
    sendModal.style.display = "block";

    const cancelButton = document.getElementById("cancelButton");
    cancelButton.addEventListener("click", () => {
      sendModal.style.display = "none";
    });

    const sendButton = document.getElementById("sendButton");
    sendButton.addEventListener("click", () => {
      // Lógica para enviar o arquivo aqui
    });
  }, 2000);
}

function abrirPlanilha(){

  window.location.href = "https://docs.google.com/spreadsheets/d/1IaYIo6PwRK6i0Aola0Akxrd8VMlur1_OIWYGctTz4O4/edit#gid=1795826749";
  
}

  const studentsArea = document.querySelector(".students-area");

// Calcula o número de alunos e colunas necessárias
const numAlunos = allStudents.filter(student => student.class === selectedClass).length;
const numColunas = Math.ceil(numAlunos / 5); // Arredonda para cima para garantir que haja pelo menos uma coluna

// Atualiza o CSS para definir o número de colunas dinamicamente
studentsArea.style.gridTemplateColumns = `repeat(${numColunas}, 1fr)`;



function displayStudents(students) {
  studentsArea.innerHTML = "";

  // Aqui estamos falando que a totalspots e = o numero total de alunos da planilha   (students.lengh divido por 5  VEZES* 5 ) const totalSpots = 35
  // Math.ceil arredonda pois 31/5 = 6.2 math.ceil arredonda para 7, 7 vezes 5 = 35 
  const totalSpots = Math.ceil(students.length / 5) * 5;

  // Aqui estamos falando que a const emptyspots e igual Totalspots = 35 MENOS students.lengh = 31  que e IGUAL A 4 
  // Assim EMPTySPOTS = 4 
  const emptySpots = totalSpots - students.length; // Calcule o número de carteiras vazias

  for (let i = 0; i < totalSpots; i++) {
    const studentElement = document.createElement("div");
    studentElement.classList.add("student");

    if (i < students.length) {
      const studentImage = document.createElement("img");
      studentImage.src = students[i].imageUrl;
      studentImage.alt = students[i].name;
      studentImage.classList.add("student-image");
      studentElement.appendChild(studentImage);

      const studentName = document.createElement("span");
      studentName.textContent = students[i].name;
      studentName.classList.add("student-name");
      studentElement.appendChild(studentName);
      studentElement.setAttribute("id", `student-${i}`); // Adiciona um ID único a cada aluno
    } else {
      studentElement.classList.add("empty-spot"); // Adicione esta linha para adicionar uma classe CSS aos espaços vazios
      studentElement.textContent = "VAZIO"; // Adicione esta linha para adicionar o texto "VAZIO" aos espaços vazios
    }

   
    studentElement.setAttribute("draggable", "true"); // Permite arrastar o elemento

    // Adiciona event listeners para arrastar e soltar
    studentElement.addEventListener("dragstart", handleDragStart);
    studentElement.addEventListener("dragend", handleDragEnd);

    studentsArea.appendChild(studentElement);
  }

  // Adiciona event listeners para a área de alunos
  studentsArea.addEventListener("dragover", handleDragOver);
  studentsArea.addEventListener("drop", handleDrop);

  // Adicione estas linhas para atualizar o elemento <h1> com a quantidade de alunos e carteiras vazias
  const studentCountElement = document.getElementById("student-count");
  studentCountElement.textContent = `Alunos: ${students.length}, Carteiras vazias: ${emptySpots}`;


  const savedOrder = JSON.parse(localStorage.getItem("studentsOrder"));
  if (savedOrder) {
    students = students.sort((a, b) => {
      const indexA = savedOrder.indexOf(a.name);
      const indexB = savedOrder.indexOf(b.name);
      return indexA - indexB;
    });
  }


}
  
  function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.target.style.opacity = "0.5";
  }
  
  function handleDragOver(event) {
    event.preventDefault();
  }

 
  
  
  
  function handleDrop(event) {
    event.preventDefault();
  
    if (event.target.closest(".student")) {
      const draggedElementId = event.dataTransfer.getData("text/plain");
      const draggedElement = document.getElementById(draggedElementId);
      const targetElement = event.target.closest(".student");
  
      // Troca a posição dos alunos (nome e imagem)
      const tempContent = targetElement.innerHTML;
      const tempClasses = [...targetElement.classList]; // Armazenamos as classes CSS do elemento alvo (ou seja, onde o estudante ou "empty-spot" está sendo solto) 
                                                        // antes de  fazer qualquer alteração. Isso é feito com const tempClasses = [...targetElement.classList];. 
  
      targetElement.innerHTML = draggedElement.innerHTML;

      targetElement.className = ''; // Limpa todas as classes CSS do elemento alvo

      targetElement.classList.add(...draggedElement.classList); //  Isso garante que se um estudante for solto em um 
                                                                //"empty-spot", o "empty-spot" manterá sua classe CSS e vice-versa.
      draggedElement.innerHTML = tempContent;

      draggedElement.className = ''; // Limpa todas as classes CSS do elemento arrastado

      draggedElement.classList.add(...tempClasses); //  Isso garante que se um estudante for solto em um 
                                                    //"empty-spot", o "empty-spot" manterá sua classe CSS e vice-versa.

      // Adiciona um ID único a cada aluno
      targetElement.setAttribute("id", `student-${Date.now()}`);
      draggedElement.setAttribute("id", `student-${Date.now() + 1}`);
  
      // Limpa o estilo aplicado durante o arrastar e soltar
      draggedElement.style.background = "";
      targetElement.style.background = "";

      //Aqui Verificamos COM IF se o Elemento que esta sendo arrastado , ou o elemento alvo = onde ira ser trocado
      // tem a Classe Empty-Spot "SE" sim executa e definimos seus estilos via JS

      // Restabelece as propriedades CSS do empty-spot

   // ELEMENTO ARRASTADO   
      if(draggedElement.classList.contains('empty-spot')){
        draggedElement.style.color = "white";
        draggedElement.style.display = "flex";
        draggedElement.style.justifyContent = "center";
        draggedElement.style.alignItems = "center";
      }
  // ELEMENTO ALVO
      if(targetElement.classList.contains('empty-spot')){
        targetElement.style.color = "white";
        targetElement.style.display = "flex";
        targetElement.style.justifyContent = "center";
        targetElement.style.alignItems = "center";
      }
    }
    saveProgress();
  }

  function handleDragEnd(event) {
    event.target.style.opacity = "1";
  } 

  



 
  
  

  
