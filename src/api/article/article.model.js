import mongoose, { Schema } from 'mongoose'

const articleSchema = new Schema({
  tite: {
    type: String
  },
  content: {
    type: String
  },
  arthur: {
    type: String
  }
}, {
  timestamps: true
})

articleSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      tite: this.tite,
      content: this.content,
      arthur: this.arthur,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

export default mongoose.model('Article', articleSchema)
