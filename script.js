/* 1. CREAR OBJETO QUE NOS CONECTA CON BD */
const db = firebase.firestore();

/* 2. CREAR DOM */
const collectionName = "Contactos";

const frm = document.querySelector("#frmContacto");
const tblContactos = document.querySelector("#tblContactos > tbody");

/* 3. CREAR ACCESOS DESDE JS - API FIRESTORE */
const findAll = async () => await db.collection(collectionName).get();

const findById = async (paramId) =>
  await db.collection(collectionName).doc(paramId).get();

const onFindAll = async (callback) =>
  await db.collection(collectionName).onSnapshot(callback);

const onInsert = async (objeto) =>
  await db.collection(collectionName).doc().set(objeto);

const onUpdate = async (paramId, objeto) =>
  await db.collection(collectionName).doc(paramId).update(objeto);

const onDelete = async (paramId) =>
  await db.collection(collectionName).doc(paramId).delete();

/* 4. CREAR EL CRUD */
window.addEventListener("load", () => {
  onFindAll((query) => {
    tblContactos.innerHTML = "";
    let totalContactos = 0;

    query.docs.forEach((doc) => {
      const contacto = doc.data();
      contacto.id = doc.id; // Agregar identificación al objeto de contacto
    });

    const sortedContacts = query.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    sortedContacts.forEach((contacto) => {
      totalContactos++; // Contador total de contactos
      tblContactos.innerHTML += `
                <tr>
                    <td>${contacto.nombre}</td>
                    <td>${contacto.email}</td>
                    <td>${contacto.mensaje}</td>
                    <td>${contacto.fecha}</td>
                    <td>
                        <button onclick="onDelete('${contacto.id}')" class="btn btn-danger">Eliminar</button>
                    </td>
                </tr>`;
    });

    // Mostrar número total de contactos
    document.querySelector(
      "#totalContactos"
    ).innerText = `Total de contactos: ${totalContactos}`;
  });
});

frm.addEventListener("submit", (ev) => {
  ev.preventDefault();

  /* 1. OBJETO CONTACTO */
  const contactoTO = {
    nombre: frm.txtNombre.value,
    email: frm.txtEmail.value,
    mensaje: frm.txtMensaje.value,
    fecha: new Date().toLocaleString(),
  };

  onInsert(contactoTO);
  frm.reset();
});
