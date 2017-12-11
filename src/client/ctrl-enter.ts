window.addEventListener("keydown", e => {
    console.log(e)
    const target = e.target as HTMLElement
    if(target.tagName.toLowerCase() != "textarea") return
    if(e.keyCode != 13) return
    if(!e.ctrlKey && !e.metaKey) return
    console.log("hit ctrl+enter")
    function parentFormSearch(target: HTMLElement | null): HTMLFormElement | null {
        if(target == null) return null
        if(target.tagName.toLowerCase() == "form") return target as HTMLFormElement
        return parentFormSearch(target.parentElement)
    }
    const form = parentFormSearch(target)
    console.log(form)
    if (form == null) return
    (form.querySelector('[type="submit"]') as HTMLElement).click()
})