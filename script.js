// Fungsi untuk memuatkan data dari JSON dan menghasilkan elemen input
window.onload = function() {
    // Memuatkan file JSON
    fetch('/students.json')
        .then(response => response.json())  // Mengambil data dari JSON
        .then(data => {
            const students = data.students;
            const form = document.getElementById("attendanceForm");

            // Loop untuk setiap pelajar dan buat checkbox dinamik
            students.forEach((student, index) => {
                const div = document.createElement("div")
                div.classList.add("checkboxItem");

                // Buat checkbox
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.classList.add("input1");
                checkbox.id = `student_${index + 1}`;
                checkbox.onclick = function() { toggleInput(this); };

                // Buat label untuk checkbox
                const label = document.createElement("label");
                label.setAttribute("for", checkbox.id);
                label.textContent = student.toUpperCase();;

                // Buat input untuk sebab
                const inputSebab = document.createElement("input");
                inputSebab.type = "text";
                inputSebab.classList.add("sebab");
                inputSebab.placeholder = "Sebab Tidak Hadir";
                inputSebab.style.display = "none";

                // Gabungkan elemen ke dalam div
                div.appendChild(checkbox);
                div.appendChild(label);
                div.appendChild(document.createElement("br"));  // Garis pemisah
                div.appendChild(inputSebab);

                // Tambahkan div ke dalam form
                form.appendChild(div);
            });
        })
        .catch(error => console.log('Error loading JSON:', error));
};

let tidakHadir = []
let hadir = []

// Fungsi untuk toggle (menunjukkan atau menyembunyikan input sebab)
function toggleInput(checkbox) {
    let sebabInput = checkbox.parentElement.querySelector('.sebab');
    let parent = checkbox.parentElement;
    
    // Jika checkbox dicentang, tunjukkan input sebab
    if (checkbox.checked) {
        parent.classList.add("isActive");
        sebabInput.style.display = "block";
    } else {
        parent.classList.remove("isActive");
        sebabInput.style.display = "none";
    }
}


function checkAttendance(){
    let checkboxes = document.querySelectorAll(".input1")
    document.querySelector(".display").style.display = "block"
    document.querySelector(".form").style.display = "none"

    checkboxes.forEach(function(checkbox,index){
        let name = checkbox.nextElementSibling
        let sebab = name.nextElementSibling.nextElementSibling
        name = name.innerText
        // Semak jika checkbox dicentang
        if (checkbox.checked) {
            tidakHadir.push(name+` (${sebab.value})`)
        } else {
            hadir.push(name)
        }
    })

// Dapatkan elemen tempat untuk paparkan hasil
let resultsDiv = document.getElementById("attendanceResults");
resultsDiv.innerHTML = ''; // Kosongkan div sebelum tambah elemen baru

// Paparkan senarai "Tidak Hadir"
let tidakHadirList = document.createElement('ul');
let hadirList = document.createElement('ul');

// Paparkan nama yang tidak hadir dengan sebab (jika ada)
if (tidakHadir.length > 0) {
    let tidakHadirTitle = document.createElement('h4');
    tidakHadirTitle.classList.add("title")
    tidakHadirTitle.textContent = "NAMA TIDAK HADIR:";
    tidakHadirList.appendChild(tidakHadirTitle);
    tidakHadirList.classList.add("dlist")
    tidakHadirList.classList.add("tidakHadir")

    tidakHadir.forEach(function (name) {
        let li = document.createElement('li');
        li.textContent = name;
        tidakHadirList.appendChild(li);
    });

    resultsDiv.appendChild(tidakHadirList);
}

// Paparkan nama yang hadir
if (hadir.length > 0) {
    let hadirTitle = document.createElement('h4');
    hadirTitle.classList.add("title")
    hadirTitle.textContent = "NAMA HADIR:";
    hadirList.appendChild(hadirTitle);
    hadirList.classList.add("dlist")
    hadirList.classList.add("hadir")

    hadir.forEach(function (name) {
        let li = document.createElement('li');
        li.textContent = name;
        hadirList.appendChild(li);
    });

    resultsDiv.appendChild(hadirList);
}
}

let refresh = document.getElementById("refresh")
refresh.addEventListener("click",()=>{
    window.location.reload()
})
 