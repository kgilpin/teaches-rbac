# Kevin Teaches RBAC

A visual course in role-based access control.

Before we talk about anything else, we need to talk about role grants.

Let's write down the roles using a simple data file format:

```yaml
# roles.yml
- id: alice

- id: bob

- id: carol

- id: employees
  members: [ alice, bob, carol ]
```

# Appendix

# Backup material

When we were children are learning about math, we started by learning to count tangible things like fingers, apples, cars and money. Eventually, we learned that you don't actually need objects to count, you can use numbers. And even later, we learned that you don't even need actual numbers, you can represent things by symbols and in so doing you gain a lot of power. Letting go of the fingers and apples opens up new avenues of potential. So, we are not going to talk about concrete things like users and groups. We are going right to the grown-up concepts and dealing with symbols. And that way, you won't be locked into overly concrete ideas about how RBAC should work or what it should be used for. 

