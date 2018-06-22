window.addEventListener("keydown", (e) => {
    const target = e.target as HTMLElement
    if (target.tagName.toLowerCase() !== "textarea") return
    if (e.keyCode !== 13) return
    if (!e.ctrlKey && !e.metaKey) return
    console.log("hit ctrl+enter")
    function parentFormSearch(element: HTMLElement | null): HTMLFormElement | null {
        if (element == null) return null
        if (element.tagName.toLowerCase() === "form") return element as HTMLFormElement
        return parentFormSearch(element.parentElement)
    }
    const form = parentFormSearch(target)
    console.log(form)
    if (form == null) return
    (form.querySelector('[type="submit"]') as HTMLElement).click()
})
