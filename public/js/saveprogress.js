function saveProgress() {
    const studentElements = document.querySelectorAll(".student");
    const order = Array.from(studentElements).map(element => element.querySelector(".student-name")?.textContent);
    localStorage.setItem("studentsOrder", JSON.stringify(order));
    console.log('Salvado');
  }
  function loadProgress(students) {
    const savedOrder = JSON.parse(localStorage.getItem("studentsOrder"));
    if (savedOrder) {
      students.sort((a, b) => savedOrder.indexOf(a.name) - savedOrder.indexOf(b.name));
      console.log('retornado', savedOrder);
    }
    return students;
   
  }