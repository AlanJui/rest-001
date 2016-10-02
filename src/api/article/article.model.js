import mongoose, { Schema } from 'mongoose'

const articleSchema = new Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    author: {
        type: String
    }
}, {
        timestamps: true
    })

articleSchema.methods = {
    view(full) {
        const view = {
            // simple view
            id: this.id,
            title: this.title,
            content: this.content,
            author: this.author,
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
