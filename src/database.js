const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://inmigracionbd:BgHpLkK85tdDRfF6@inmigracionforms.ifretmm.mongodb.net/?retryWrites=true&w=majority') //mongodb://localhost/bot-autollenado )
  .then(db => console.log('DB is connected'))
  .catch(err => console.log(err));
