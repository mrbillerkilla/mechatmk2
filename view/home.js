 // Haal de user-info op via de server
 fetch('/user-info')
 .then(response => response.json())
 .then(data => {
     document.getElementById('user-info').innerHTML = `
         <p>Ingelogd als: <strong>${data.username}</strong></p>
         <p>Gebruikers-ID: <strong>${data.userId}</strong></p>
     `;
     // Zet de userId en username beschikbaar voor berichten
     window.currentUserId = data.userId;
     window.currentUsername = data.username;

     // ✅ Roep hier de functie aan
     loadPrivateChats();
 })
 .catch(err => {
     console.error('Fout bij ophalen van gebruikersinformatie:', err);
     document.getElementById('user-info').innerHTML = '<p>Niet ingelogd</p>';
 });


     fetch('/groups')
     .then(response => response.json())
     .then(groups => {
         const groupListDiv = document.getElementById('group-list');

         groups.forEach(group => {
             // Maak een knop voor elke groep
             const button = document.createElement('button');
             button.textContent = group.group_name;
             button.onclick = () => {
                 // Ga naar de groepschat met de juiste group_id
                 window.location.href = `/group_chat.html?group_id=${group.id}`;
             };
             groupListDiv.appendChild(button);
         });
     })
     .catch(err => {
         console.error('Fout bij ophalen van groepen:', err);
     });

  // Functie om de privéchats op te halen en knoppen te genereren
  function loadPrivateChats() {
     fetch('/users')
         .then(response => response.json())
         .then(users => {
             const privateChatsDiv = document.getElementById('private-chats');
             privateChatsDiv.innerHTML = '';  // Maak de lijst leeg

             users.forEach(user => {
                 // Maak een knop voor elke gebruiker
                 const button = document.createElement('button');
                 button.textContent = `Chat met ${user.username}`;
                 button.style.margin = '10px';
                 button.onclick = () => {
                     window.location.href = `/private_chat.html?user_id=${user.id}`;
                 };

                 privateChatsDiv.appendChild(button);
             });
         })
         .catch(err => console.error('Fout bij ophalen van gebruikers:', err));
 }