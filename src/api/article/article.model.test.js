import test from 'ava'
import mockgoose from 'mockgoose'
import mongoose from '../../config/mongoose'
import { schema } from '.'

test.beforeEach(async (t) => {
  const mongo = new mongoose.Mongoose()
  await mockgoose(mongo)
  await mongo.connect('')
  const Article = mongo.model('Article', schema)
  const article = await Article.create({ tite: 'test', content: 'test', arthur: 'test' })

  t.context = { ...t.context, Article, article }
})

test.cb.after.always((t) => {
  mockgoose.reset(t.end)
})

test('view', (t) => {
  const { article } = t.context
  const view = article.view()
  t.true(typeof view === 'object')
  t.true(view.id === article.id)
  t.true(view.tite === article.tite)
  t.true(view.content === article.content)
  t.true(view.arthur === article.arthur)
  t.truthy(view.createdAt)
  t.truthy(view.updatedAt)
})

test('full view', (t) => {
  const { article } = t.context
  const view = article.view(true)
  t.true(typeof view === 'object')
  t.true(view.id === article.id)
  t.true(view.tite === article.tite)
  t.true(view.content === article.content)
  t.true(view.arthur === article.arthur)
  t.truthy(view.createdAt)
  t.truthy(view.updatedAt)
})
