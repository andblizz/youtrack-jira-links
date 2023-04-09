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
      const newRow = document.createElement('tr');
      newRow.className = 'yt-issue-fields-panel__row';
      const newKeyCell = document.createElement('td');
      newKeyCell.className = 'yt-issue-key-value-list__column yt-issue-key-value-list__column_key';
      const newValueCell = document.createElement('td');
      newValueCell.className = 'yt-issue-key-value-list__column yt-issue-key-value-list__column_value';

      // Добавляем метку поля Jira links
      const newFieldLabel = document.createElement('span');
      newFieldLabel.className = 'yt-issue-fields-panel__field-label';
      newFieldLabel.textContent = 'Jira links';
      newKeyCell.appendChild(newFieldLabel);

      // Создаем элемент-контейнер для ссылок на задачи Jira
      const jiraLinksContainer = document.createElement('span');
      jiraLinksContainer.id = 'jiraLinksContainer';
      newValueCell.appendChild(jiraLinksContainer);

      // Вставляем ячейки в новую строку
      newRow.appendChild(newKeyCell);
      newRow.appendChild(newValueCell);

      // Вставляем новую строку после строки с полем Jira
      row.parentNode.insertBefore(newRow, row.nextSibling);

      // Функция для обновления ссылок на задачи Jira при загрузке страницы
      function updateJiraLinks(valueText) {
        // Разделение текста на массив номеров задач
        const taskNumbers = valueText.split(/[,/]\s*/).map(num => num.trim());

        // Проверка на наличие номеров задачи и отсутствие текста
        const containsOnlyNumbers = taskNumbers.every(num => /^\d+$/.test(num));

        if (containsOnlyNumbers) {
          jiraLinksContainer.innerHTML = '';
          taskNumbers.forEach((num, index) => {
            const jiraLink = document.createElement('a');
            jiraLink.href = `https://jira.mos.ru/browse/EDDEV-${num}`;
            jiraLink.target = '_blank';
            jiraLink.innerText = `EDDEV-${num}`;
            jiraLink.style.color = '#70b1e6';
            jiraLink.style.textDecoration = 'none';
            jiraLinksContainer.appendChild(jiraLink);
            if (index < taskNumbers.length - 1) {
              const separator = valueText.includes('/') ? ' / ' : ', ';
              jiraLinksContainer.appendChild(document.createTextNode(separator));
            }
          });
        } else {
          newRow.style.display = 'none';
        }
      }

      // Обновляем ссылки при загрузке страницы
      updateJiraLinks(valueText);
    }
  });
}

function waitForYouTrackFields() {
  console.log("Ожидание полей Youtrack");
  const observer = new MutationObserver((mutations) => {
    if (document.querySelector('span.yt-issue-fields-panel__field-label')) {
      console.log("Поля Youtrack найдены");
      observer.disconnect();
      addJiraLink();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

waitForYouTrackFields();
