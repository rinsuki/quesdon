import * as React from "react"
import { Link } from "react-router-dom"
import { Button, FormGroup, FormText, Input, InputGroup, InputGroupAddon } from "reactstrap"
import { apiFetch } from "../../../api-fetch"
import { me } from "../../../initial-state"
import { Checkbox } from "../../common/checkbox"
import { Title } from "../../common/title"

interface State {
    descriptionMax: number
    questionBoxNameMax: number
    descriptionCount: number
    questionBoxNameCount: number
    saving: boolean
}

export class PageMySettings extends React.Component<{}, State> {
    constructor(props: any) {
        super(props)
        if (!me) return
        this.state = {
            descriptionMax: 200,
            questionBoxNameMax: 10,
            descriptionCount: (me.description || "").length,
            questionBoxNameCount: (me.questionBoxName || "質問箱").length,
            saving: false,
        }
    }
    render() {
        if (!me) return null
        return <div>
            <Title>設定</Title>
            <h1>設定</h1>
            <Link to="/my">マイページに戻る</Link>
            <form action="javascript://" onSubmit={this.onSubmit.bind(this)}>
                <FormGroup>
                    <label>ちょっとした説明</label>
                    <Input type="textarea" name="description"
                        placeholder="しぶやのりんさんがすき"
                        onInput={this.inputDescription.bind(this)}
                        defaultValue={me.description}/>
                    <FormText>あと{this.descriptionRemaining()}文字 改行は表示時に反映されません</FormText>
                </FormGroup>
                <FormGroup>
                    <label>「質問箱」の名称変更</label>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">◯◯◯さんの</InputGroupAddon>
                        <Input type="text" name="questionBoxName" placeholder="質問箱"
                            onInput={this.inputQuestionBoxName.bind(this)}
                            defaultValue={me.questionBoxName || "質問箱"}/>
                    </InputGroup>
                    <FormText>あと{this.questionBoxNameRemaining()}文字 改行は表示時に反映されません</FormText>
                </FormGroup>
                <FormGroup>
                    <Checkbox name="allAnon" value="1" checked={me.allAnon}>自分宛ての質問では名乗らせない</Checkbox>
                </FormGroup>
                <FormGroup>
                    <Checkbox name="stopNewQuestion" value="1" checked={me.stopNewQuestion}>新たな質問を受け付けない</Checkbox>
                </FormGroup>
                <Button type="submit" color="primary" disabled={this.sendableForm()}>
                    保存{this.state.saving && "しています..."}
                </Button>
            </form>
            <h2 className="mt-3 mb-2">プッシュ通知</h2>
            {me.pushbulletEnabled
            ?   <Button color="warning" onClick={this.pushbulletDisconnect.bind(this)}>Pushbulletとの接続を解除する</Button>
            :   <Button href="/api/web/accounts/pushbullet/redirect" color="success">
                    Pushbulletと接続して新しい質問が来た際に通知を受け取る
                </Button>
            }
            <h2 className="mt-3 mb-2">やばいゾーン</h2>
            <Button color="danger" onClick={this.allDeleteQuestions.bind(this)}>自分宛ての質問を(回答済みのものも含めて)すべて削除</Button>
            <Button color="success" onClick={this.exportAnswers.bind(this)}>回答済みの質問を一括エクスポート</Button>
        </div>
    }

    sendableForm() {
        return this.questionBoxNameRemaining() < 0 || this.descriptionRemaining() < 0 || this.state.saving
    }

    descriptionRemaining() {
        return this.state.descriptionMax - this.state.descriptionCount
    }

    questionBoxNameRemaining() {
        return this.state.questionBoxNameMax - this.state.questionBoxNameCount
    }

    inputDescription(e: any) {
        this.setState({
            descriptionCount: e.target.value.length,
        })
    }

    inputQuestionBoxName(e: any) {
        this.setState({
            questionBoxNameCount: e.target.value.length,
        })
    }

    async pushbulletDisconnect() {
        function errorMsg(code: number | string) {
            return "通信に失敗しました。再度お試しください (" + code + ")"
        }
        const req = await apiFetch("/api/web/accounts/pushbullet/disconnect", {
            method: "POST",
        }).catch((e) => {
            alert(errorMsg(-1))
        })
        if (!req) return
        if (!req.ok) {
            alert(errorMsg("HTTP-" + req.status))
            return
        }

        const res = await req.json().catch((e) => {
            alert(errorMsg(-2))
        })
        if (!res) return

        alert("切断しました。")
        location.reload()
    }

    async allDeleteQuestions() {
        function errorMsg(code: number | string) {
            return "通信に失敗しました。再度お試しください (" + code + ")"
        }
        if (!me) return
        const rand = Math.floor(Math.random() * 9) + 1
        if (prompt(`あなた(@${me.acctDisplay})あてに来た質問を「回答済みのものも含めて全て」削除します。

確認のために「${rand}」を下に入力してください(数字だけ入力してください)`, "") !== rand.toString()) return
        const req = await apiFetch("/api/web/questions/all_delete", {
            method: "POST",
        }).catch((e) => {
            alert(errorMsg(-1))
        })
        if (!req) return
        if (!req.ok) {
            alert(errorMsg("HTTP-" + req.status))
            return
        }

        const res = await req.json().catch((e) => {
            alert(errorMsg(-2))
            return
        })
        if (!res) return

        alert("削除しました。")
        location.reload()
    }

    async exportAnswers() {
        const req = await apiFetch("/api/web/questions/export", {
            method: "POST",
        })
        const b = await req.blob()
        const anchor = document.createElement("a")
        anchor.href = window.URL.createObjectURL(b)
        anchor.target = "_blank"
        anchor.download = req.headers.get("X-File-Name") + ".zip"
        anchor.click()
    }

    async onSubmit(e: any) {
        function errorMsg(code: number | string) {
            return "通信に失敗しました。再度お試しください (" + code + ")"
        }
        this.setState({saving: true})

        const form = new FormData(e.target)
        const req = await apiFetch("/api/web/accounts/update", {
            method: "POST",
            body: form,
        }).catch(() => {
            alert(errorMsg(-1))
            this.setState({
                saving: false,
            })
        })
        if (!req) return
        if (!req.ok) {
            alert(errorMsg("HTTP-" + req.status))
            this.setState({
                saving: false,
            })
            return
        }

        const res = req.json().catch(() => {
            alert(errorMsg(-2))
            this.setState({
                saving: false,
            })
        })
        if (!res) return

        alert("更新しました!")
        location.reload()
    }

}
