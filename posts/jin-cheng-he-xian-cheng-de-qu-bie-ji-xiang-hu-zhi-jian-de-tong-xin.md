---
title: '进程和线程的区别及相互之间的通信'
date: 2021-03-18 18:27:19
tags: [计算机基础,前端开发]
published: true
hideInList: false
feature: 
isTop: false
---
进程与线程的概念，以及为什么要有进程线程，其中有什么区别，他们各自又是怎么同步的?

## 基本概念

进程是对运行时程序的封装，是系统进行资源调度和分配的的基本单位，实现了操作系统的并发

线程是进程的子任务，是CPU调度和分派的基本单位，用于保证程序的实时性，实现进程内部的并发；线程是操作系统可识别的最小执行和调度单位。每个线程都独自占用一个虚拟处理器：独自的寄存器组，指令计数器和处理器状态。每个线程完成不同的任务，但是共享同一地址空间（也就是同样的动态内存，映射文件，目标代码等等），打开的文件队列和其他内核资源

## 区别

一个线程只能属于一个进程，而一个进程可以有多个线程，但至少有一个线程，线程依赖于进程而存在

进程在执行过程中拥有独立的内存单元，而多个线程共享进程的内存（资源分配给进程，同一进程的所有线程共享该进程的所有资源。同一进程中的多个线程共享代码段（代码和常量），数据段（全局变量和静态变量），扩展段（堆存储）。但是每个线程拥有自己的栈段，栈段又叫运行时段，用来存放所有局部变量和临时变量）

进程是资源分配的最小单位，线程是 CPU 调度的最小单位

### 系统开销

由于在创建或撤消进程时，系统都要为之分配或回收资源，如内存空间、I／O 设备等。因此，操作系统所付出的开销将显著地大于在创建或撤消线程时的开销。类似地，在进行进程切换时，涉及到整个当前进程 CPU 环境的保存以及新被调度运行的进程的 CPU 环境的设置。而线程切换只须保存和设置少量寄存器的内容，并不涉及存储器管理方面的操作。可见，进程切换的开销也远大于线程切换的开销。

### 通信

由于同一进程中的多个线程具有相同的地址空间，致使它们之间的同步和通信的实现，也变得比较容易。进程间通信 IPC ，线程间可以直接读写进程数据段（如全局变量）来进行通信 —— 需要进程同步和互斥手段的辅助，以保证数据的一致性。在有的系统中，线程的切换、同步和通信都无须操作系统内核的干预

进程编程调试简单可靠性高，但是创建销毁开销大；线程正相反，开销小，切换速度快，但是编程调试相对复杂

进程间不会相互影响，线程一个线程挂掉将导致整个进程挂掉

进程适应于多核、多机分布；线程适用于多核

**进程间通信的方式**

进程间通信主要包括管道、系统 IPC（包括消息队列、信号量、信号、共享内存等）、以及套接字 socket

1 管道

管道主要包括匿名管道和命名管道:管道可用于具有亲缘关系的父子进程间的通信，命名管道除了具有管道所具有的功能外，它还允许无亲缘关系进程间的通信

1.1 匿名管道PIPE

它是半双工的（即数据只能在一个方向上流动），具有固定的读端和写端
它只能用于具有亲缘关系的进程之间的通信（也是父子进程或者兄弟进程之间）
它可以看成是一种特殊的文件，对于它的读写也可以使用普通的read、write等函数。但是它不是普通的文件，并不属于其他任何文件系统，并且只存在于内存中。

1.2 命名管道FIFO

FIFO可以在无关的进程之间交换数据
FIFO有路径名与之相关联，它以一种特殊设备文件形式存在于文件系统中

2 系统 IPC

2.1 消息队列

消息队列，是消息的链接表，存放在内核中。一个消息队列由一个标识符（即队列ID）来标记。(消息队列克服了信号传递信息少，管道只能承载无格式字节流以及缓冲区大小受限等特点)具有写权限得进程可以按照一定得规则向消息队列中添加新信息；对消息队列有读权限得进程则可以从消息队列中读取信息；

特点：

- 消息队列是面向记录的，其中的消息具有特定的格式以及特定的优先级。
- 消息队列独立于发送与接收进程。进程终止时，消息队列及其内容并不会被删除。
- 消息队列可以实现消息的随机查询,消息不一定要以先进先出的次序读取,也可以按消息的类型读取。
  
2.2 信号量 semaphore

信号量（semaphore）与已经介绍过的 IPC 结构不同，它是一个计数器，可以用来控制多个进程对共享资源的访问。信号量用于实现进程间的互斥与同步，而不是用于存储进程间通信数据。

特点：

- 信号量用于进程间同步，若要在进程间传递数据需要结合共享内存。
- 信号量基于操作系统的PV操作，程序对信号量的操作都是原子操作。
- 每次对信号量的PV操作不仅限于对信号量值加1或减1，而且可以加减任意正整数。
- 支持信号量组。

2.3 信号 signal

信号是一种比较复杂的通信方式，用于通知接收进程某个事件已经发生。

2.4 共享内存（SharedMemory）

它使得多个进程可以访问同一块内存空间，不同进程可以及时看到对方进程中对共享内存中数据得更新。这种方式需要依靠某种同步操作，如互斥锁和信号量等

特点：

- 共享内存是最快的一种IPC，因为进程是直接对内存进行存取
- 因为多个进程可以同时操作，所以需要进行同步
- 信号量+共享内存通常结合在一起使用，信号量用来同步对共享内存的访问

3 套接字 SOCKET

socket也是一种进程间通信机制，与其他通信机制不同的是，它可用于不同主机之间的进程通信。

**线程间通信的方式**

- 临界区：通过多线程的串行化来访问公共资源或一段代码，速度快，适合控制数据访问；
- 互斥量Synchronized/Lock：采用互斥对象机制，只有拥有互斥对象的线程才有访问公共资源的权限。因为互斥对象只有一个，所以可以保证公共资源不会被多个线程同时访问
- 信号量 Semphare：为控制具有有限数量的用户资源而设计的，它允许多个线程在同一时刻去访问同一个资源，但一般需要限制同一时刻访问此资源的最大线程数目。
- 事件(信号)，Wait/Notify：通过通知操作的方式来保持多线程同步，还可以方便的实现多线程优先级比较操作
