function showLoading(isLoading) {
    const loadingElement = document.getElementById("loading");
    loadingElement.style.display = isLoading ? "flex" : "none";
}

async function getData() {
    try {
        showLoading(true);
        const response = await fetch('https://gist.githubusercontent.com/AzrilSyamin/04e5ead136a1c18201c044ed53b0cc9e/raw/b56f1eef80804332a569988eef47a80be32e1018/students.json');
        
        const data = await response.json();
        // set loading 2 second
        setTimeout(()=>{
            showLoading(false);
        },3000);

        return data.students;
    } catch (error) {
        throw error;
    }
}

let absentData = [];
let presentData = [];
const count = {
    "present": 0,
    "absent": 0
}
window.onload = async function () {
    const students = await getData();
    const tableBody = document.querySelector('.data');

    // set default value 
    count.present = students.length;
    const present = document.getElementById("present")
    const absent = document.getElementById("absent")

    // Loop through students and generate table rows
    students.forEach((student, index) => {
        student = student.toUpperCase();
        const row = document.createElement('tr');

        // Create name cell
        const noCell = document.createElement('td');
        noCell.textContent = index + 1;
        row.appendChild(noCell);

        // Create name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = student;
        row.appendChild(nameCell);

        // Create switch cell
        const switchCell = document.createElement('td');
        switchCell.className = 'text-center';

        // Create custom switch
        const switchLabel = document.createElement('label');
        switchLabel.className = 'custom-switch';

        const switchInput = document.createElement('input');
        switchInput.type = 'checkbox';
        switchInput.className = 'toggleSwitch';
        switchInput.setAttribute("data-name", student)

        const switchSpan = document.createElement('span');
        switchSpan.className = 'slider';

        const circleSpan = document.createElement('span');
        circleSpan.className = 'circle';

        const textSpan = document.createElement('span');
        textSpan.className = 'text';

        switchSpan.appendChild(circleSpan);
        switchSpan.appendChild(textSpan);
        switchLabel.appendChild(switchInput);
        switchLabel.appendChild(switchSpan);
        switchCell.appendChild(switchLabel);
        row.appendChild(switchCell);

        // Append row to table body
        tableBody.appendChild(row);

        // Add event listener for the switch
        switchInput.addEventListener('change', (e) => {
            const getDataName = e.target.getAttribute('data-name')
            if (e.target.checked) {
                count.absent++;
                count.present--;
                absentData.push({ name: getDataName, reason: "" });
                document.querySelector("#name").value = getDataName;
                document.querySelector("#reason").value = "";
                const modal = new bootstrap.Modal(document.getElementById('reasonModal'));
                modal.show();

                // get data from modal
                const btnReason = document.querySelector("#saveReason");
                btnReason.addEventListener("click", () => {
                    const name = document.querySelector("#name").value;
                    const reason = document.querySelector("#reason").value;
                    absentData.map(user => {
                        if (user.name === name) {
                            return user.reason = reason;
                        }
                    });
                    modal.hide();
                    // console.log(absentData);
                })
            } else {
                count.present++;
                count.absent--;
                absentData = absentData.filter(user => user.name !== getDataName);
            }
            present.innerText = count.present;
            absent.innerText = count.absent;
            presentData = students.filter(user => !absentData.some(absent=>absent.name.toUpperCase() === user.toUpperCase()));
        });
    });
    present.innerText = count.present;
    absent.innerText = count.absent;
    presentData = students.filter(user => !absentData.some(absent => absent.name.toUpperCase() === user.toUpperCase()));

    // getAbsentData on submit
    const confirm = document.getElementById("confirm");
    confirm.addEventListener("click", getAbsentData);

};

// action after submit 
function getAbsentData() {
    const confirmation = confirm("Make sure everything is accurate before submitting. Do you want to proceed?");
    if (!confirmation) {
        return;
    }
    checkAttendance();

    // copy to clipboard after create element 
    const btnAbsent = document.querySelector("#absentData button");
    btnAbsent.addEventListener("click", () => copyListToClipboard("absentData"));
    const btnPresent = document.querySelector("#presentData button");
    btnPresent.addEventListener("click", () => copyListToClipboard("presentData"));
}

// create page after submit 
function checkAttendance() {
    document.querySelector(".display").style.display = "block"
    document.querySelector(".my-container").style.display = "none"
    document.getElementById("header-title").innerText = "Attendance Status Computer System 5B"
    // refresh 
    let refresh = document.getElementById("refresh")
    refresh.addEventListener("click", () => {
        window.location.reload()
    })

    // Dapatkan elemen tempat untuk paparkan hasil
    let resultAbsent = document.getElementById("absentData");
    let resultPresent = document.getElementById("presentData");
    resultAbsent.innerHTML = ''; // Kosongkan div sebelum tambah elemen baru
    resultPresent.innerHTML = ''; // Kosongkan div sebelum tambah elemen baru

    // Paparkan senarai "Tidak Hadir"
    let absentList = document.createElement('ul');
    let presentList = document.createElement('ul');

    // Paparkan nama yang tidak hadir dengan sebab (jika ada)
    if (absentData.length > 0) {
        absentList.classList.add("card", "bg-danger", "text-white", "pt-3", "mb-5", "list-group")

        // create title 
        let absentTitle = document.createElement('h4');
        absentTitle.classList.add("ps-3", "pb-1", "fw-bold", "text-center")
        absentTitle.textContent = "NAME LIST ABSENT:";
        absentList.appendChild(absentTitle);

        // create button 
        let btnAbsent = document.createElement('button')
        btnAbsent.classList.add("btn", "btn-warning", "w-75", "mb-3", "align-self-center")
        btnAbsent.textContent = "Copy To Clipboard!"
        absentList.appendChild(btnAbsent);

        absentData.forEach(function (user,index) {
            let li = document.createElement('li');
            li.classList.add("list-group-item")
            li.innerHTML = `${index+1}. ${user.name} <b>(${user.reason})</b>`;
            absentList.appendChild(li);
        });

        resultAbsent.appendChild(absentList);
    }

    // Paparkan nama yang hadir
    if (presentData.length > 0) {
        presentList.classList.add("card", "bg-info", "pt-3", "mb-5", "list-group")

        // create title 
        let presentTitle = document.createElement('h4');
        presentTitle.classList.add("ps-3", "pb-1", "fw-bold", "text-center")
        presentTitle.textContent = "NAME LIST PRESENT:";
        presentList.appendChild(presentTitle);

        // create button 
        let btnPresent = document.createElement('button')
        btnPresent.classList.add("btn", "btn-primary", "w-75", "mb-3", "align-self-center")
        btnPresent.textContent = "Copy To Clipboard!"
        presentList.appendChild(btnPresent);

        presentData.forEach(function (name,index) {
            let li = document.createElement('li');
            li.classList.add("list-group-item")
            li.textContent = `${index+1}. ${name}`;
            presentList.appendChild(li);
        });

        resultPresent.appendChild(presentList);
    }
}

function copyListToClipboard(id) {
    // Dapatkan semua elemen <li> dalam senarai
    const listItems = document.querySelectorAll(`#${id} li`);

    // Tukarkan ke dalam array teks, asingkan dengan baris baru
    const textToCopy = Array.from(listItems)
        .map(li => li.textContent.trim())
        .join("\n");

    // Salin ke clipboard
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("The list of names has been copied to the clipboard!");
    }).catch(err => {
        console.error("Error: ", err);
    });
}
