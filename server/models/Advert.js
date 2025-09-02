import mongoose from 'mongoose';

const advertSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    image: { type: String, required: true },
}, { timestamps: true });

const Advert = mongoose.model('advert', advertSchema);

export default Advert;


