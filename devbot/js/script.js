const textarea = document.querySelector('textarea');

const initialTextareaHeight = textarea.scrollHeight

async function createBotReply(content) {
  const API_URL = 'https://api.openai.com/v1/chat/completions';
  const API_KEY = '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';

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content
        }
      ]
    })
  })
  const data = await response.json()

  return data.choices[0].message.content

}

function createChatMessage(message, type) {
  const li = document.createElement("li");
  li.classList.add("message", type);
  const p = document.createElement("p");
  if (type === "bot") {
    const i = document.createElement("i");
    i.classList.add("fa-solid", "fa-robot", "fa-xl");
    li.appendChild(i);
  }
  p.textContent = message;
  li.appendChild(p);
  return li;
}

function handleCloseChat () {
    document.body.classList.remove('open-chat')
}
 function handleToggleChat(){
    document.body.classList.toggle('open-chat')
    
 }

 function handleChatOnKeyDown (event){
    if (event.key == 'Enter' ) {
        event.preventDefault()
        handleChat()
    }
 }

 function handleAutoSize(){
    textarea.style.height = '$ {initialTextareaHeight}px'
    textarea.style.height = '$ {textarea.scrollHeight}px'
 }

async function handleChat() {
  const textareaValue = textarea.value.trim();
  console.log({ textareaValue });
  if (!textareaValue) {
    return;
  }

  const userMessage = createChatMessage(textareaValue, 'user');

  const messageHistory = document.querySelector('ul');
  const main = document.querySelector('main');

  messageHistory.appendChild(userMessage);
  main.scrollTo(0, main.scrollHeight)

  textarea.value = "";

  const botMessage = createChatMessage("Digitando...", "bot");

  setTimeout(() => {
    messageHistory.appendChild(botMessage);
    main.scrollTo(0, main.scrollHeight)
  }, 500);

  try {
    const botReply = await createBotReply(textareaValue)
    botMessage.querySelector('p').textContent = botReply
    main.scrollTo(0, main.scrollHeight)
    

  } catch (error) {
    botMessage.querySelector('p').textContent = 'OPS! ALGO DEU ERRADO, TENTE NOVAMENTE'
    botMessage.querySelector('p').classList.add('error')
  }
}
