module.exports = () => ({
	io: {
		enabled: true,
		config: {
			contentTypes: ['*'],
			events: [
				{
					name: 'connection',
					handler({ strapi, io }, socket) {
						strapi.log.info(`[io] new connection with id ${socket.id}`);

						socket.emit("getId", socket.id);

						socket.on("sendDataClient", (data) => {
							console.log('sendDataClient');
							console.log(data);
							// https://strapi-plugin-io.netlify.app/api/io-class.html
							strapi.$io.raw({ event: 'sendDataServer', data: data });

						});

						socket.on('disconnect', () => {
							console.log('A user disconnected');
						});
					},
				},
			],
			socket: {
				serverOptions: {
					cors: {
						origin: '*',
						methods: ['GET', 'POST'],
					},
				},
			},
		},
	},
});
