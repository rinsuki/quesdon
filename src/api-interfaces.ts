export interface APIQuestion {
    _id: string
    updatedAt: string
    createdAt: string
    user: APIUser
    question: string
    isNSFW: boolean
    likesCount: number
    isDeleted: boolean

    questionUser: APIUser | undefined
    answer: string | undefined
    answeredAt: string | undefined
}

export interface APIUser {
    _id: string
    updatedAt: string
    createdAt: string
    name: string
    acct: string
    avatarUrl: string
    url: string
    allAnon: boolean
    questionBoxName: string | undefined
    description: string | undefined
    hostName: string
    pushbulletEnabled: boolean
}