Link multiple bluetooth devices:

```
pactl load-module module-combine-sink
```

Shattering sound fix:

```
/usr/share/pipewire/pipewire.conf -> link.max-buffers = 64
```

How to list bluetooth devices:

```
hcitool dev
```

How to change volume of device:

```
pactl list short
pactl set-sink-volume <DEVICE_ID (e.g. 235)> 20000
```
