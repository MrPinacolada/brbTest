import { onMounted, onBeforeUnmount, type Ref } from "vue";

export function useContentEditableLimiter(
  elRef: Ref<HTMLElement | null>,
  maxLength: number
) {
  const onInput = (e: Event) => {
    const el = e.target as HTMLElement;
    const text = el.innerText;

    if (text.length > maxLength) {
      el.innerText = text.slice(0, maxLength);
      placeCaretAtEnd(el);
    }
  };

  onMounted(() => {
    elRef.value?.addEventListener("input", onInput);
  });

  onBeforeUnmount(() => {
    elRef.value?.removeEventListener("input", onInput);
  });
}

function placeCaretAtEnd(el: HTMLElement) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  sel?.removeAllRanges();
  sel?.addRange(range);
}
