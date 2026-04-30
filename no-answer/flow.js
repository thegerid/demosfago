(function () {
  function init(options) {
    if (!options) {
      return null;
    }

    const buttons = Array.from(options.buttons || []).filter(Boolean);
    const toastNode = options.toastNode;
    const toastTextNode = options.toastTextNode;
    const toastIconNode = options.toastIconNode;
    const toastCloseButton = options.toastCloseButton;
    const resolveKey = typeof options.resolveKey === "function"
      ? options.resolveKey
      : function resolveDefaultKey(button) {
          return button;
        };

    if (!buttons.length || !toastNode || !toastTextNode || !toastIconNode || !toastCloseButton) {
      return null;
    }

    const requested = new WeakSet();
    let toastTimer = null;

    function hideToast() {
      if (toastTimer) {
        window.clearTimeout(toastTimer);
        toastTimer = null;
      }
      toastNode.classList.remove("open", "success", "warning");
    }

    function showToast(kind, text) {
      hideToast();
      toastTextNode.textContent = text;
      toastNode.classList.add(kind === "warning" ? "warning" : "success");
      toastNode.classList.add("open");
      if (kind === "warning") {
        toastIconNode.innerHTML = '<circle cx="7" cy="7" r="7" fill="currentColor"/><path d="M7 3.9V7.4" stroke="#202127" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="10.1" r=".85" fill="#202127"/>';
      } else {
        toastIconNode.innerHTML = '<path d="M3.2 7.1 5.8 9.6 10.8 4.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>';
      }
      toastTimer = window.setTimeout(function autoHideToast() {
        hideToast();
      }, 3600);
    }

    buttons.forEach(function bindNoAnswerButton(button) {
      button.addEventListener("click", function handleNoAnswerClick() {
        const key = resolveKey(button) || button;
        if (!requested.has(key)) {
          requested.add(key);
          showToast("success", "Запрос о недозвоне принят в работу.");
          return;
        }
        showToast("warning", "Запрос о недозвоне после интервала встречи уже принят.");
      });
    });

    toastCloseButton.addEventListener("click", hideToast);

    return {
      hideToast: hideToast,
      showToast: showToast
    };
  }

  window.DemoSfaGoNoAnswerFlow = {
    init: init
  };
})();
