import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server online');
  console.log(`PORT ${PORT}`);
});
