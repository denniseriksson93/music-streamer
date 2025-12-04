Link multiple bluetooth devices:

```
pactl load-module module-combine-sink
```

Shattering sound fix:

```
/usr/share/pipewire/pipewire.conf -> link.max-buffers = 64
```
