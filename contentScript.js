// Определение констант
const JIRA_BASE_URL = 'https://task.mos-team.ru/browse/';
const SHEET_BASE_URL = 'https://docs.google.com/spreadsheets/d/1EolYL1o0C0YQ8iMI-l2VjDILkU1ITBY8/edit#gid=1730455537&range=';

// Функция для создания DOM элемента
function createDOMElement(tag, props, ...children) {
    const element = document.createElement(tag);
    Object.assign(element, props);
    children.forEach(child => {
        if (typeof child === 'string') {
            child = document.createTextNode(child);
        }
        element.appendChild(child);
    });
    return element;
}

function addJiraLink() {
  console.log("addJiraLink вызван");

  const labels = document.querySelectorAll('span.yt-issue-fields-panel__field-label');

  labels.forEach(label => {
    console.log("Проверка метки:", label.textContent);

    if (label.textContent.includes('Jira')) {
      console.log("Найдена метка Jira");

      const row = label.closest('tr');
      const valueElement = row.querySelector('.yt-issue-key-value-list__column_value');
      const valueText = valueElement.textContent.trim();

      // Создаем новую строку и ячейки для поля Jira links
      const newRow = createDOMElement('tr', {className: 'yt-issue-fields-panel__row'});
      const newKeyCell = createDOMElement('td', {className: 'yt-issue-key-value-list__column yt-issue-key-value-list__column_key'});
      const newValueCell = createDOMElement('td', {className: 'yt-issue-key-value-list__column yt-issue-key-value-list__column_value'});

      // Добавляем метку поля Jira links
      const newFieldLabel = createDOMElement('span', {className: 'yt-issue-fields-panel__field-label', textContent: 'Jira links'});
      newKeyCell.appendChild(newFieldLabel);

      // Создаем элемент-контейнер для ссылок на задачи Jira
      const jiraLinksContainer = createDOMElement('span', {id: 'jiraLinksContainer'});
      newValueCell.appendChild(jiraLinksContainer);

      // Вставляем ячейки в новую строку
      newRow.append(newKeyCell, newValueCell);

      // Вставляем новую строку после строки с полем Jira
      row.parentNode.insertBefore(newRow, row.nextSibling);

      // Функция для обновления ссылок на задачи Jira и Google Sheets при загрузке страницы
      function updateJiraLinks(valueText) {
        const taskNumbers = valueText.split(/[,/]\s*/).map(num => num.trim());

        jiraLinksContainer.innerHTML = '';

      // Регулярные выражения и поиск номеров задач и строк
      const numRegex = /^\d+$/;
      const orgRegex = /^EDDEVORG-\d+$/;
      const expRegex = /^EDEXP-\d+$/;
      const strRegex = /стр\.?\s*((?:\d+)(?:-\d+)?)/i;

      taskNumbers.forEach((num, index) => {
        let link;

        if (numRegex.test(num)) {
          link = createDOMElement('a', {href: `${JIRA_BASE_URL}EDDEV-${num}`, target: '_blank', textContent: `EDDEV-${num}`});
        } else if (orgRegex.test(num)) {
          link = createDOMElement('a', {href: `${JIRA_BASE_URL}${num}`, target: '_blank', textContent: num});
        } else if (expRegex.test(num)) {
          link = createDOMElement('a', {href: `${JIRA_BASE_URL}${num}`, target: '_blank', textContent: num});
        } else {
          const match = strRegex.exec(num);
          if (match) {
            const rowNumbers = match[1].split('-').map(n => parseInt(n, 10) + 1);
            link = createDOMElement('a', {href: `${SHEET_BASE_URL}${rowNumbers[0]}:${rowNumbers[1] || rowNumbers[0]}`, target: '_blank', textContent: num});
          }          
        }


        if (link) {
          link.style.color = '#70b1e6';
          link.style.textDecoration = 'none';
          jiraLinksContainer.appendChild(link);

          if (index < taskNumbers.length - 1) {
            const separator = valueText.includes('/') ? ' / ' : ', ';
            jiraLinksContainer.appendChild(document.createTextNode(separator));
          }
        }
      });

        // Показываем строку Jira links, если есть хотя бы одна ссылка
        newRow.style.display = jiraLinksContainer.childNodes.length ? '' : 'none';
      }

      try {
        // Обновляем ссылки при загрузке страницы
        updateJiraLinks(valueText);
      } catch (e) {
        console.error('Ошибка при обновлении ссылок на Jira:', e);
      }
    }
  });
}

function waitForYouTrackFields() {
  console.log("Ожидание полей Youtrack");

  const observer = new MutationObserver((mutations) => {
    if (document.querySelector('span.yt-issue-fields-panel__field-label')) {
      console.log("Поля Youtrack найдены");
      observer.disconnect();
      try {
        addJiraLink();
      } catch (e) {
        console.error('Ошибка при добавлении ссылок на Jira:', e);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

waitForYouTrackFields();
