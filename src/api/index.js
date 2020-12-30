export async function getData () {
    const response = await fetch('/people');
    const json = await response.json();

    return json;
}

export async function getOne (id) {
  const response = await fetch(`/people/${id}`);
  const json = await response.json();

  return json;
}

export async function postData (data) {
  const response = await fetch('/people', {
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
const json = await response.json();
return json;
}

export async function updateData (id, data) {
  fetch(`people/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));
}

export async function deleteData (id) {
  fetch(`people/${id}`, {
  method: 'DELETE',
});
}



