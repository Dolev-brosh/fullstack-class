const addNoteBtn = document.getElementById('add-note-btn');
const noteMenu = document.getElementById('note-menu');
const noteBtn = document.querySelectorAll('.color-btn');
const notesContainer = document.getElementById('notes-area');


addNoteBtn.addEventListener("click", ()=> {
    noteMenu.classList.toggle("show");
})




noteMenu.addEventListener('click', (e) => {
    const target = e.target;

    if(target.classList.contains('color-btn')){
        const colorClass = target.id;

        addNotes('', '', colorClass);
    }
});

function saveNoteToLocalStorage(noteArray){
    localStorage.setItem('notes', JSON.stringify(noteArray));
}

function loadNotesFromLocalStorage(){
    const notes = localStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
}

function addNotes(text, dateTime, color){
    const notes = loadNotesFromLocalStorage();

    const newNote = {
        id: Date.now(),
        text, 
        dateTime,
        color
    };

    notes.push(newNote);
    saveNoteToLocalStorage(notes);

    const noteElement = createNoteFromData(newNote);
    notesContainer.prepend(noteElement);
}

function deleteNote(id){
    let notes = loadNotesFromLocalStorage();
    notes = notes.filter(note => note.id !== id);
    saveNoteToLocalStorage(notes);
}

window.addEventListener('DOMContentLoaded', () => {
    const notes = loadNotesFromLocalStorage();
    notes.forEach(note => {
        const noteElement = createNoteFromData(note);
        notesContainer.prepend(noteElement);
    })
})

function createNoteFromData({id, text, dateTime, color}){
    const note = createNote();
    const textarea = note.querySelector('.note-body-input');
    const dateInput = note.querySelector('.date-time-input');

    note.dataset.id = id;
    textarea.value = text;
    dateInput.value = dateTime;
    note.style.background = `var(--${color})`;

    setupNoteLogic(note, id);
    return note;
}

function deleteAllNotes() {
    localStorage.removeItem('notes');

    notesContainer.innerHTML = '';
}

const deleteAllBtn = document.getElementById('delete-all-btn');

deleteAllBtn.addEventListener('click', () => {
    deleteAllNotes();
    
});