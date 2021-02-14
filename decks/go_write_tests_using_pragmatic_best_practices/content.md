# Go Write Tests
Using Pragmatic Best Practices

Edward Haas, @redhat <!-- .element: style="position: absolute; left: 0; top: 100%; font-size: 0.6em" -->
edwardh.dev@gmail.com <!-- .element: style="position: absolute; left: 0; top: 120%; font-size: 0.6em" -->

Note:
- Welcome, talk about tests.
- Sync on some basic tests definitions
- Present some practices I consider worthy with examples in Go and Python

---

# /me 

Note:
- My name is
- Started without tests. 
- An integral part of development.

---

# Testing

Why?

Note: Increase quality, help development, express usage.

---

# Testing Levels

- Unit
- Integration
- System

Note:
We can also consider compilation of typed languages and linters as an
early development testing level.

Most practices should fit them all.

---

# Test Definitions 

--

# Test Format <!-- .element: style="font-size: 1.8em" -->

- Setup
- Exercise
- Verify
- Teardown

Note: A test is expected to include these steps in its flow, although
some may have no content.

--

## Assertion

expected vs actual results 

Note:
- Appear mainly in the verify step, but may also end up in the setup and
  teardown.
- Some test frameworks differentiate the error type when failing in the
  fixtures or in the test body (exercise and verify step).

--

# Skipping

- Explicitly by the test runner.
- Explicitly by the test author.
- Conditioned at run-time.

Note:
It is useful to:
- Run a subset of tests, filtering out some.
- Declare in-code that a test is broken and needs attention (XFail).
- Dynamically detect that a test cannot run on the platform.
  I consider this a bad practice, as it may be missed.

Consider the use of marking/labeling to filter the test list.
This leaves the control to the test runner logic and avoids unintentional
skips to occur (which in turn introduces holes in the coverage).

--

# Focus

Note:
This is the opposite of skipping.

Run only a specific test group, which is useful during development.

It emphasises the need to have a test well isolated and not dependent on other
tests.

---

# Test Best Practices

Note:
Language and framework agnostic.

May be opinionated and controversial.

<!-- .slide: data-background-image="cat_glasses.jpg" data-background-opacity="0.4"-->

--

# Fail First

Note: Are you sure the test can fail? Maybe it always passes.

--

# Body vs Fixture

Note: Separate setup/teardown from test body

--

<!-- .slide: data-transition="fade" -->

```python






def test_dog_runs(dog):
    with Dog("Pingo") as dog:
        dog.run()

        assert dog.is_running()
```

--

<!-- .slide: data-transition="fade" -->

```python
@pytest.fixture
def dog()
    with Dog("Pingo") as dog:
        yield dog

def test_dog_runs(dog):
    dog.run()

    assert dog.is_running()
```

--

# Isolation

Note:
- No dependency between tests.
- Be a good citizen, clean on exit.

Avoid leaks, it leads to chaos.

--

<!-- .slide: data-transition="fade" -->

```golang
var _ = Describe("Dog", func() {
    var dog = &Dog{}
    Context("is hungry", func() {
        var gulash := newGulash()


        BeforeEach(func() { dog.MakeHungry() })

        It("eats gulash and feels full", func() {
            dog.Eat(gulash)

            Equal(dog.isHungry()).To(BeFalse())
        })
    })
})

```

--

<!-- .slide: data-transition="fade" -->

```golang
var _ = Describe("Dog", func() {
    var dog = &Dog{}
    Context("is hungry", func() {
        var gulash := newGulash()

        BeforeEach(func() { dog.Reborn() })
        BeforeEach(func() { dog.MakeHungry() })

        It("eats gulash and feels full", func() {
            dog.Eat(gulash)

            Equal(dog.isHungry()).To(BeFalse())
        })
    })
})

```

--

<!-- .slide: data-transition="fade" -->

```golang
var _ = Describe("Dog", func() {
    var dog = &Dog{}
    Context("is hungry", func() {
        var gulash := newGulash()

        BeforeEach(func() { dog.MakeHungry() })
        AfterEach(func() { dog.Reborn() })

        It("eats gulash and feels full", func() {
            dog.Eat(gulash)

            Equal(dog.isHungry()).To(BeFalse())
        })
    })
})

```

--

# Keep Assertions visible

--

<!-- .slide: data-transition="fade" -->

```golang
var _ = Describe("Developer", func() {
    var dev Developer
    BeforeEach(func() { dev = newDeveloper("Bog") })
    It("writes buggy code", func() {
         writeCode(&dev)

         Expect(dev.hasBugs()).To(BeTrue())
    })
})
func writeCode(developer *Developer) {
    code, err := code.CreateCodeWithBugs()
    Expect(err).NotTo(HaveOccurred())
    developer.WriteCode(code)

}
```

--

<!-- .slide: data-transition="fade" -->

```golang
var _ = Describe("Developer", func() {
    var dev Developer
    BeforeEach(func() { dev = newDeveloper("Bog") })
    It("writes buggy code", func() {
         Expect(writeCode(&dev)).To(Succeed())

         Expect(dev.hasBugs()).To(BeTrue())
    })
})
func writeCode(developer *Developer) error {
    code, err := code.CreateCodeWithBugs()
    if err != nil { return err }
    developer.WriteCode(code)
    return nil
}
```

--

# Traceability

<!-- .slide: data-background-image="traceability.jpg" data-background-opacity="0.3"-->

Note:
On failure, it should be clear what failed.

- Assure enough info exists in the assertion (test name, variable names and
content).
- Make it easy to track the assertion location.
- Use ID/s to correlate between the test objects and the system logs. 
- Collect relevant logs and information from the system.
- For logs, mark the start and end of the test to help with troubleshooting. 

--

# Shared Resources

<!-- .slide: data-background-image="share_keyboard.jpg" data-background-opacity="0.3"-->

--

<!-- .slide: data-background-image="share_keyboard.jpg" data-background-opacity="0.3"-->

<!-- .slide: data-transition="fade" -->

```python
@pytest.fixture
def fedora_vm()
    vm = virtualmachine.create_and_run("fedora")
    yield vm 
    virtualmachine.delete(vm)

def test_vm_connectivity(fedora_vm):
    assert fedora_vm.ping("ehaas.net")

def test_vm_console(fedora_vm):
    assert fedora_vm.console("\n\n") != ""
```

--

<!-- .slide: data-background-image="share_keyboard.jpg" data-background-opacity="0.3"-->

<!-- .slide: data-transition="fade" -->

```python
@pytest.fixture
def fedora_vm(scope="module")
    vm = virtualmachine.create_and_run("fedora")
    yield vm 
    virtualmachine.delete(vm)

def test_vm_connectivity(fedora_vm):
    assert fedora_vm.ping("ehaas.net")

def test_vm_console(fedora_vm):
    assert fedora_vm.console("\n\n") != ""
```

--

# Continue On Failure

Note: Expect tests to fail, stopping on the first failure is not informative
      enough.
      Said that, support leaving the system "freezed" for advance debugging.

<!-- .slide: data-background-image="never_give_up.jpg" data-background-opacity="0.3"-->

--

# XFail

Expect to Fail

Note:
- Record a detected bug.
- Record a missing feature.
- Execute functionality and focus on a specific failure.

--

<!-- .slide: data-transition="fade" -->

```golang
var _ = Describe("slack", func() {
    It("can make coffee", func() {
        s, err := slack.New("test")
        Expect(err).NotTo(HasOccurred())

        assert.XFail("Not yet implemented", func() {
            Equal(s.Make("coffee")).NotTo(BeNil())
        })
    })
})
```

--

# Avoid Dead Tests

Note: Production code has tests. Tests have only themselves.
      Do not leave unexecuted code, it rots.
      Keep only running tests.

--

<!-- .slide: data-transition="fade" -->

```python
@pytest.mark.skip(
    reason="Dog cannot yet talk, working on it"

)
def test_dog_is_talking(dog):
    dog.Talk("hello")
```

--

<!-- .slide: data-transition="fade" -->

```python
@pytest.mark.xfail(
    reason="Dog cannot yet talk, working on it",
    raises=AttributeError
)
def test_dog_is_talking(dog):
    dog.Talk("hello")
```

--

# Parallel Tests

<!-- .slide: data-background-image="parallel.jpg" data-background-opacity="0.3"-->

Note:
- Can decrease substantially the runtime for I/O bound operations.
- Multi threaded/process matter.
- Exercising in parallel against a single SUT:
  - The SUT needs to support it.
  - Introduces randomization.
  - Logs may be harder to read.

An amount of uncertainty is introduced,
something that tests try to avoid in order to be reproducible and
consistent in their reported results.

Projects should balance between efficient runtime,
covering concurrent access to the SUT and the risk of uncertainty and
debugging effort.

--

# !Randomization & Logic

Note:
Random Testing have their own test category, do not mix them with
"regular" tests.

Logic in tests should be limited, it competes with production code and
may by itself be(come) wrong.

---

# The imperfect world 

Workarounds

Note:
- Questionable approaches.
- Can be considered as anti-patterns.
- May be too costly to solve it in any other way.

--

# Stop On Failure

Note:
When a test fails, stop the execution of the whole suite,
clean nothing and collect all available information from the system.

In some cases, leave it as is for a developer to debug the state in which it is.

On the other hand, is this a very limited issue or
is it breaking a larger domain.

--

# Clean @ Setup

Note:
The test pattern recognizes that there is a need for a test to start on a
fresh clean setup. However, it suggests not to clean at a test teardown stage
but at a test early setup.

- It is simple (no need to cleanup after yourself).
- Needs to be generic.
- New resource types may not be included.
- Violates isolation (assumes next test will cleanup).
- May be harder to troubleshoot.

---

Q&A

---

# Thank You

https://ehaas.net/slides/decks/go_write_tests_using_pragmatic_best_practices

