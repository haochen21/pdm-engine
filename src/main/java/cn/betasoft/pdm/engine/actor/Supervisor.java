package cn.betasoft.pdm.engine.actor;

import akka.actor.*;
import cn.betasoft.pdm.engine.config.akka.ActorBean;
import cn.betasoft.pdm.engine.config.akka.SpringProps;
import cn.betasoft.pdm.engine.model.Device;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * pdm actor 根类，系统中所有的其它actor都是它的孩子
 */
@ActorBean
public class Supervisor extends AbstractActor {

	static public class DeviceInfo {

		private final Set<Device> devices;

		public DeviceInfo(Set<Device> devices) {
			this.devices = devices;
		}

		public Set<Device> getDevices() {
			return devices;
		}
	}

	@Autowired
	private ActorSystem actorSystem;

	// key:deviceIp
	private Map<String, ActorRef> deviceActorRefs = new HashMap<>();

	private static final Logger logger = LoggerFactory.getLogger(Supervisor.class);

	@Override
	public Receive createReceive() {
		return receiveBuilder().match(DeviceInfo.class, deviceInfo -> {
			logger.info("Received device message,size is: {}", deviceInfo.getDevices().size());
			deviceInfo.getDevices().stream().forEach(device -> {
				if (!deviceActorRefs.containsKey(device.getIp())) {
					createDeviceActor(device);
				}
			});
		}).matchAny(o -> logger.info("received unknown message {}",o.toString())).build();
	}

	private void createDeviceActor(Device device) {
		Props props = SpringProps.create(actorSystem, DeviceActor.class, new Object[] { device });
		ActorRef actorRef = getContext().actorOf(props, "d-" + device.getIp());
		this.getContext().watch(actorRef);
		deviceActorRefs.put(device.getIp(), actorRef);
	}
}