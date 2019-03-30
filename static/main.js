document.addEventListener("DOMContentLoaded", () => {
	const root = document.getElementById("app")
	root.innerHTML = ""
	root.className="container mt-4"
	
	const profile = document.createElement("div")
	profile.className = "jumbotron"
	profile.style.textAlign = "center"
	root.appendChild(profile)

	const profileIcon = document.createElement("img")
	profileIcon.src = user.avatarUrl
	profileIcon.style.width = "8em"
	profileIcon.style.height = "8em"
	profile.appendChild(profileIcon)

	const profileName = document.createElement("h1")
	profileName.innerText = user.name
	profile.appendChild(profileName)

	const profileSubText = document.createElement("p")
	profileSubText.innerText = "さんの" + user.questionBoxName
	profile.appendChild(profileSubText)

	const profileMastodonLink = document.createElement("a")
	profileMastodonLink.innerText = "Mastodonのプロフィール"
	profileMastodonLink.href = user.url || `https://${user.hostName}/@${user.acct.split("@")[0]}`
	profileMastodonLink.target = "_blank"
	profileMastodonLink.style.display = "block"
	profile.appendChild(profileMastodonLink)

	const profileDesc = document.createElement("div")
	profileDesc.innerText = user.description
	profile.appendChild(profileDesc)

	const answersTitle = document.createElement("h2")
	answersTitle.innerText = "回答"
	root.appendChild(answersTitle)
	
	const questionCount = document.createElement("span")
	questionCount.className = "ml-2 badge badge-secondary badge-pill"
	questionCount.innerText = answers.length.toString()
	answersTitle.appendChild(questionCount)

	for (const answer of answers) {
		const container = document.createElement("div")
		container.className="mt-3 card"
		root.appendChild(container)

		const body = document.createElement("div")
		body.className="card-body"
		container.appendChild(body)

		const title = document.createElement("h4")
		title.className="card-title"
		title.innerText = answer.question
		body.appendChild(title)
		
		const subtitle = document.createElement("h6")
		subtitle.className="card-subtitle mb-2"
		body.appendChild(subtitle)

		const time = document.createElement("span")
		time.className="text-muted"
		time.innerText = moment(answer.answeredAt).format("YYYY-MM-DD HH:mm:ss")
		subtitle.appendChild(time)

		if (answer.questionUser) {
			const questionUserContainer = document.createElement("span")
			questionUserContainer.className = "ml-2"
			questionUserContainer.innerText = "質問者: "
			subtitle.appendChild(questionUserContainer)
			
			const questionUserLink = document.createElement("a")
			questionUserLink.href = answer.questionUser.url || `https://${answer.questionUser.hostName}/@${answer.questionUser.acct.split("@")[0]}`
			questionUserLink.innerText = answer.questionUser.name
			questionUserLink.target = "_blank"
			questionUserContainer.appendChild(questionUserLink)

			const questionUserAcct = document.createElement("span")
			questionUserAcct.className = "text-muted"
			questionUserAcct.innerText = "@" + answer.questionUser.acct
			questionUserLink.appendChild(questionUserAcct)
		}
		
		const p = document.createElement("p")
		p.className="question-text card-text"
		p.innerText = answer.answer
		body.appendChild(p)
	}
})