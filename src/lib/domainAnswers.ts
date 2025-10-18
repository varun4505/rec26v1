import type { PrismaClient } from '@prisma/client'

export type AnswerPrimitive = string | number | boolean | string[]

export type QAItem = {
  id?: string
  question?: string
  answer: AnswerPrimitive
}

export type AnswersList = QAItem[]

export function isAnswerPrimitive(v: unknown): v is AnswerPrimitive {
  return (
    typeof v === 'string' ||
    typeof v === 'number' ||
    typeof v === 'boolean' ||
    (Array.isArray(v) && v.every((x) => typeof x === 'string'))
  )
}

export function validateAnswersList(input: unknown): AnswersList {
  if (!Array.isArray(input)) throw new Error('answers must be an array')

  const out: AnswersList = []
  for (const [i, raw] of input.entries()) {
    if (raw == null || typeof raw !== 'object') throw new Error(`answers[${i}] must be an object`)
    const maybe = raw as Record<string, unknown>
    if (!('answer' in maybe)) throw new Error(`answers[${i}] missing 'answer'`)
    const ans = maybe['answer']
    if (!isAnswerPrimitive(ans)) throw new Error(`answers[${i}].answer must be string|number|boolean|string[]`)

    const qa: QAItem = { answer: ans as AnswerPrimitive }
    if ('question' in maybe && typeof maybe['question'] === 'string') qa.question = String(maybe['question'])
    if ('id' in maybe && typeof maybe['id'] === 'string') qa.id = String(maybe['id'])
    out.push(qa)
  }
  return out
}

export async function createDomainSubmissionFromList(
  prisma: PrismaClient,
  applicationId: string,
  domain: string,
  answersList: unknown
) {
  const validated = validateAnswersList(answersList)
  return prisma.domainSubmission.create({ data: { applicationId, domain, answers: validated as any } })
}

export async function replaceDomainSubmissionAnswersWithList(
  prisma: PrismaClient,
  submissionId: string,
  answersList: unknown
) {
  const validated = validateAnswersList(answersList)
  return prisma.domainSubmission.update({ where: { id: submissionId }, data: { answers: validated as any } })
}

export async function appendToDomainSubmissionAnswersList(
  prisma: PrismaClient,
  submissionId: string,
  items: unknown
) {
  const validated = validateAnswersList(items)
  const existing = await prisma.domainSubmission.findUnique({ where: { id: submissionId } })
  if (!existing) throw new Error('DomainSubmission not found')
  const current = Array.isArray(existing.answers) ? (existing.answers as any[]) : []
  const merged = [...current, ...validated]
  return prisma.domainSubmission.update({ where: { id: submissionId }, data: { answers: merged as any } })
}

