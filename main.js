let request = indexedDB.open("Documents", 1);

let db;

let contentedit = document.getElementById("contentedit");
let titleedit = document.getElementById("titleedit");

params = new URLSearchParams(window.location.search);
let id = params.get("id");

request.onupgradeneeded = function(event) {
    let _db = event.target.result;

    if (!_db.objectStoreNames.contains("docs")) {
        _db.createObjectStore("docs", { keyPath: "id"});
    }
};

request.onsuccess = function(event) {
    db = event.target.result;
    
    console.log("Database opened successfully");
};

request.onerror = function(event) {
    console.error("Database error:", event.target.error);
}

function AddDoc(filename, blob) {
    if (db) {
    let transaction = db.transaction("docs", "readwrite");
    let store = transaction.objectStore("docs");
    store.put({id: id, filename: filename, file: blob });

    transaction.oncomplete = () => console.log("Data added");
    transaction.onerror = () => console.error("Error adding data");
    }

}

function GetDoc(key) {
    if (db) {
        let transaction = db.transaction("docs", "readonly");
        let store = transaction.objectStore("docs");
        let request = store.get(key);
        
        request.onsuccess =  async ()=> {
               let record = request.result;
        if (!record) {
            console.error("File not found");
            return;
        }
        content = await record.file.text();
        title = record.filename.replace(".html", "");
        console.log(content, title);
        titleedit.value = title;
        contentedit.innerHTML = content;
        };
    }
}
function GetContents() {
    let content = contentedit.innerHTML;
    let blob = new Blob([content],  { type: "text/html" });
    return blob;
} 
function Save() {
    let title = titleedit.value;
    console.log(title)
    let filename = title + ".html"

    let blob = GetContents();

    AddDoc(filename, blob);
}

function Load() {
    GetDoc(id);
}