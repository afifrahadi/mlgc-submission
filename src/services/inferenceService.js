const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification (model, image) {
  try {
    const tensor = tf.node.decodePng(image).resizeNearestNeighbor([224, 224]).expandDims().toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = score[0] * 100;

    let predictionResult = '';

    if (confidenceScore > 50) {
      predictionResult = 'Cancer';
    };

    if (confidenceScore <= 50) {
      predictionResult = 'Non-cancer';
    };

    const label = predictionResult
    let suggestion;

    if (label === 'Cancer') {
      suggestion = 'Segera periksa ke dokter!';
    };

    if (label === 'Non-cancer') {
      suggestion = 'Penyakit kanker tidak terdeteksi.';
    };

    return { confidenceScore, label, suggestion};
  } catch (error) {
      throw new InputError(error.message);
  }
};

module.exports = predictClassification;